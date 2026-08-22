const INITIAL_STOCK = require('./_stock-data');

async function redisPipeline(url, token, commands) {
  const r = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  return r.json();
}

async function redisSet(url, token, key, value) {
  await fetch(`${url}/set/${encodeURIComponent(key)}/${value}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://luanda.com.es');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Password');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminPass = process.env.ADMIN_PASSWORD;
  if (adminPass && req.headers['x-admin-password'] !== adminPass) {
    return res.status(403).json({ error: 'Contraseña incorrecta' });
  }

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return res.status(500).json({ error: 'KV no configurado' });

  if (req.method === 'POST') {
    const { name, qty } = req.body || {};
    if (!name || qty === undefined || qty === null) {
      return res.status(400).json({ error: 'name y qty son requeridos' });
    }
    if (!INITIAL_STOCK.hasOwnProperty(name)) {
      return res.status(400).json({ error: 'Producto no encontrado' });
    }
    const value = Math.max(0, parseInt(qty) || 0);
    await redisSet(url, token, `stock:${name}`, value);
    return res.json({ ok: true, name, qty: value });
  }

  // GET — devuelve todos los productos con stock actual
  const names = Object.keys(INITIAL_STOCK);
  const commands = [
    ...names.map(n => ['get', `stock:${n}`]),
    ...names.map(n => ['get', `sold:${n}`]),
  ];
  const results = await redisPipeline(url, token, commands);

  const products = names.map((name, i) => {
    const override = results[i]?.result;
    let qty;
    if (override !== null && override !== undefined) {
      qty = Math.max(0, parseInt(override));
    } else {
      const sold = results[i + names.length]?.result;
      qty = Math.max(0, INITIAL_STOCK[name] - (sold != null ? parseInt(sold) : 0));
    }
    return { name, qty, initial: INITIAL_STOCK[name] };
  });

  res.json(products);
};
