// Llamado desde pago-ok.html cuando el pago es exitoso
// Body: { items: [{ name: "Producto", qty: 2 }, ...] }

async function redisIncrBy(url, token, key, by) {
  await fetch(`${url}/incrby/${encodeURIComponent(key)}/${by}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return res.json({ ok: true, note: 'KV not configured' });

  const { items } = req.body || {};
  if (!Array.isArray(items)) return res.status(400).json({ error: 'items required' });

  await Promise.all(
    items.map(({ name, qty }) => redisIncrBy(url, token, `sold:${name}`, Math.max(1, parseInt(qty) || 1)))
  );

  res.json({ ok: true });
};
