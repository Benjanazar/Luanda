module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://luanda.com.es');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { items, shipping, total, orderRef } = req.body || {};
  const apiKey = process.env.RESEND_API_KEY;
  const sellerEmail = process.env.LUANDA_NOTIFY_EMAIL || 'info@luanda.com.es';

  if (!apiKey) return res.status(200).json({ ok: false, reason: 'no api key' });
  if (!items?.length || !shipping) return res.status(400).json({ ok: false });

  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#f5f0e8">${i.qty > 1 ? `${i.qty}x ` : ''}${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #2a2a2a;color:#c9a84c;text-align:right">${(parseFloat(i.price) * i.qty).toFixed(2).replace('.', ',')} €</td>
    </tr>`
  ).join('');

  const shipInfo = shipping.direccion
    ? `${shipping.direccion}, ${shipping.cp} ${shipping.ciudad}`
    : shipping.tipo === 'inpost' ? 'Locker InPost (se coordinará por WhatsApp)' : 'Recogida en tienda';

  const sellerHtml = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#111;font-family:Georgia,serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(201,168,76,0.2)">
  <div style="background:#111;padding:28px 32px;border-bottom:1px solid rgba(201,168,76,0.15);text-align:center">
    <p style="margin:0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#c9a84c">Luanda Shop</p>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:400;color:#f5f0e8">🛍️ Nuevo pedido recibido</h1>
  </div>
  <div style="padding:28px 32px">
    <h2 style="margin:0 0 16px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#c9a84c;font-weight:400">Datos del cliente</h2>
    <p style="margin:0 0 6px;color:#f5f0e8"><strong>${shipping.nombre}</strong></p>
    <p style="margin:0 0 6px;color:rgba(245,240,232,.65)">📱 ${shipping.telefono}</p>
    ${shipping.email ? `<p style="margin:0 0 6px;color:rgba(245,240,232,.65)">✉️ ${shipping.email}</p>` : ''}
    <p style="margin:0 0 6px;color:rgba(245,240,232,.65)">📦 ${shipping.label}</p>
    <p style="margin:0 0 20px;color:rgba(245,240,232,.65)">📍 ${shipInfo}</p>

    <h2 style="margin:0 0 12px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#c9a84c;font-weight:400">Productos</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${itemRows}</table>

    ${shipping.cost > 0 ? `<p style="margin:0 0 6px;color:rgba(245,240,232,.65);text-align:right">Envío: ${shipping.cost.toFixed(2).replace('.', ',')} €</p>` : ''}
    <p style="margin:0;font-size:18px;color:#c9a84c;text-align:right"><strong>Total: ${parseFloat(total).toFixed(2).replace('.', ',')} € ✅ Pagado</strong></p>
    ${orderRef ? `<p style="margin:12px 0 0;font-size:11px;color:rgba(245,240,232,.35);text-align:right">Ref. ${orderRef}</p>` : ''}
  </div>
</div>
</body></html>`;

  const buyerHtml = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#111;font-family:Georgia,serif">
<div style="max-width:560px;margin:0 auto;background:#0d0d0d;border:1px solid rgba(201,168,76,0.2)">
  <div style="background:#111;padding:28px 32px;border-bottom:1px solid rgba(201,168,76,0.15);text-align:center">
    <p style="margin:0;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#c9a84c">Luanda Shop</p>
    <h1 style="margin:8px 0 0;font-size:22px;font-weight:400;color:#f5f0e8">¡Gracias por tu compra! ✨</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="color:rgba(245,240,232,.75);line-height:1.7;margin:0 0 24px">Hola <strong style="color:#f5f0e8">${shipping.nombre}</strong>, hemos recibido tu pedido correctamente. En breve nos pondremos en contacto contigo para gestionar el envío.</p>

    <h2 style="margin:0 0 12px;font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#c9a84c;font-weight:400">Resumen del pedido</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${itemRows}</table>

    <p style="margin:0 0 6px;color:rgba(245,240,232,.65)">📦 ${shipping.label}: ${shipping.cost > 0 ? shipping.cost.toFixed(2).replace('.', ',') + ' €' : 'Gratis'}</p>
    ${shipping.direccion ? `<p style="margin:0 0 6px;color:rgba(245,240,232,.65)">📍 ${shipInfo}</p>` : ''}
    <p style="margin:16px 0 0;font-size:18px;color:#c9a84c;text-align:right"><strong>Total pagado: ${parseFloat(total).toFixed(2).replace('.', ',')} €</strong></p>

    <p style="margin:28px 0 0;color:rgba(245,240,232,.45);font-size:12px;line-height:1.7">¿Dudas? Escríbenos por WhatsApp al <a href="https://wa.me/34610898948" style="color:#c9a84c">610 898 948</a></p>
  </div>
</div>
</body></html>`;

  const sends = [
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Luanda Shop <pedidos@luanda.com.es>',
        to: sellerEmail,
        subject: `🛍️ Nuevo pedido — ${shipping.nombre} — ${parseFloat(total).toFixed(2).replace('.', ',')} €`,
        html: sellerHtml,
      }),
    }),
  ];

  if (shipping.email) {
    sends.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Luanda Shop <pedidos@luanda.com.es>',
          to: shipping.email,
          reply_to: sellerEmail,
          subject: '¡Tu pedido en Luanda Shop está confirmado! ✅',
          html: buyerHtml,
        }),
      })
    );
  }

  await Promise.allSettled(sends);
  res.json({ ok: true });
};
