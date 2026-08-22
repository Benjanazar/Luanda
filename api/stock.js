const INITIAL_STOCK = require('./_stock-data');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) return res.json(INITIAL_STOCK);

  const names = Object.keys(INITIAL_STOCK);

  // Una sola llamada en pipeline: primero overrides de admin, luego ventas
  const commands = [
    ...names.map(n => ['get', `stock:${n}`]),
    ...names.map(n => ['get', `sold:${n}`]),
  ];

  const r = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  const results = await r.json();

  const stock = {};
  names.forEach((name, i) => {
    const override = results[i]?.result;
    if (override !== null && override !== undefined) {
      stock[name] = Math.max(0, parseInt(override));
    } else {
      const sold = results[i + names.length]?.result;
      stock[name] = Math.max(0, INITIAL_STOCK[name] - (sold != null ? parseInt(sold) : 0));
    }
  });

  res.json(stock);
};
