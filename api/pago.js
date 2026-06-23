const crypto = require('crypto');

const MERCHANT_CODE = '370494809';
const TERMINAL      = '001';
const CURRENCY      = '978'; // EUR

// Cambiar REDSYS_TEST a 'false' en Vercel cuando BBVA dé el pase a producción
const REDSYS_URL = process.env.REDSYS_TEST === 'false'
  ? 'https://sis.redsys.es/sis/realizarPago'
  : 'https://sis-t.redsys.es:25443/sis/realizarPago';

function pad8(buf) {
  const r = buf.length % 8;
  return r === 0 ? buf : Buffer.concat([buf, Buffer.alloc(8 - r, 0)]);
}

function signRedsys(merchantParams, order, secretKey) {
  const key        = Buffer.from(secretKey, 'base64');
  const iv         = Buffer.alloc(8, 0);
  const cipher     = crypto.createCipheriv('des-ede3-cbc', key, iv);
  cipher.setAutoPadding(false);
  const derivedKey = Buffer.concat([cipher.update(pad8(Buffer.from(order))), cipher.final()]);
  return crypto.createHmac('sha256', derivedKey).update(merchantParams).digest('base64');
}

module.exports = function handler(req, res) {
  const { name, price } = req.query;
  const secretKey = process.env.REDSYS_SECRET_KEY;

  if (!secretKey)                          return res.status(500).send('Pasarela no configurada — añade REDSYS_SECRET_KEY en Vercel.');
  if (!name || !price || isNaN(+price))    return res.status(400).send('Parámetros inválidos.');
  if (+price <= 0)                         return res.status(400).send('Precio no disponible.');

  const order  = Date.now().toString().slice(-8); // 8 dígitos únicos
  const amount = Math.round(+price * 100).toString();

  const params = {
    DS_MERCHANT_MERCHANTCODE:    MERCHANT_CODE,
    DS_MERCHANT_TERMINAL:        TERMINAL,
    DS_MERCHANT_ORDER:           order,
    DS_MERCHANT_AMOUNT:          amount,
    DS_MERCHANT_CURRENCY:        CURRENCY,
    DS_MERCHANT_TRANSACTIONTYPE: '0',
    DS_MERCHANT_PRODUCTDESCRIPTION: name.substring(0, 125),
    DS_MERCHANT_URLOK:  'https://luanda.com.es/pago-ok.html',
    DS_MERCHANT_URLKO:  'https://luanda.com.es/pago-error.html',
  };

  const merchantParams = Buffer.from(JSON.stringify(params)).toString('base64');
  const signature      = signRedsys(merchantParams, order, secretKey);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Procesando…</title>
<style>body{margin:0;background:#0d0d0d;color:#c9a84c;font-family:sans-serif;
display:flex;align-items:center;justify-content:center;height:100vh;text-align:center}
.spin{font-size:36px;animation:r 1s linear infinite}@keyframes r{to{transform:rotate(360deg)}}
p{opacity:.6;margin-top:12px;font-size:13px}</style></head>
<body><div><div class="spin">⟳</div><p>Redirigiendo a la pasarela segura BBVA…</p></div>
<form id="f" action="${REDSYS_URL}" method="POST" style="display:none">
  <input name="Ds_SignatureVersion"   value="HMAC_SHA256_V1">
  <input name="Ds_MerchantParameters" value="${merchantParams}">
  <input name="Ds_Signature"          value="${signature}">
</form>
<script>document.getElementById('f').submit();</script>
</body></html>`);
};
