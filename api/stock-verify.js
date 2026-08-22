// Verifica que el pago fue real (firma Redsys) antes de decrementar stock
const crypto = require('crypto');

function pad8(buf) {
  const r = buf.length % 8;
  return r === 0 ? buf : Buffer.concat([buf, Buffer.alloc(8 - r, 0)]);
}

function verifySignature(merchantParams, signature, secretKey) {
  try {
    const decoded = Buffer.from(merchantParams, 'base64');
    const params  = JSON.parse(decoded.toString());
    const order   = params.Ds_Order || params.DS_MERCHANT_ORDER || '';
    const key     = Buffer.from(secretKey, 'base64');
    const iv      = Buffer.alloc(8, 0);
    const cipher  = crypto.createCipheriv('des-ede3-cbc', key, iv);
    cipher.setAutoPadding(false);
    const derivedKey = Buffer.concat([cipher.update(pad8(Buffer.from(order))), cipher.final()]);
    const expected   = crypto.createHmac('sha256', derivedKey).update(merchantParams).digest('base64');
    const normalize  = s => s.replace(/-/g, '+').replace(/_/g, '/');
    const responseCode = parseInt(params.Ds_Response || '9999');
    return normalize(expected) === normalize(signature) && responseCode <= 99;
  } catch {
    return false;
  }
}

async function redisCmd(url, token, cmd, key, arg) {
  const path = arg !== undefined
    ? `/${cmd}/${encodeURIComponent(key)}/${arg}`
    : `/${cmd}/${encodeURIComponent(key)}`;
  const r = await fetch(`${url}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  const d = await r.json();
  return d.result ?? null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://luanda.com.es');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { Ds_MerchantParameters, Ds_Signature, items } = req.body || {};
  const secretKey = process.env.REDSYS_SECRET_KEY;

  if (!secretKey) return res.status(500).json({ error: 'not configured' });
  if (!Ds_MerchantParameters || !Ds_Signature) return res.status(400).json({ error: 'missing params' });
  if (!Array.isArray(items) || !items.length) return res.status(400).json({ error: 'items required' });

  if (!verifySignature(Ds_MerchantParameters, Ds_Signature, secretKey)) {
    return res.status(403).json({ error: 'invalid signature' });
  }

  const kvUrl   = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    await Promise.all(
      items.map(({ name, qty }) =>
        redisIncrBy(kvUrl, kvToken, `sold:${name}`, Math.max(1, parseInt(qty) || 1))
      )
    );
  }

  res.json({ ok: true });
};
