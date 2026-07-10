// Stock inicial — editar aquí cuando cambies el inventario
const INITIAL_STOCK = {
  'Fortalecedor de Pestañas EELHOE': 2,
  'Sérum Antiarrugas L\'Oreal Revitalift': 6,
  'Kit Aerógrafo Rosa Recargable — Nail Art': 1,
  'Rubber Gel Ojo de Gato NB N-007': 8,
  'Rubber Gel Ojo de Gato Plata NB N-002': 8,
  'Rubber Gel Ojo de Gato Iris Plata NB N-005': 8,
  'Esponja Lima NB Leda 100/180 Pack 10': 9,
  'Gafas Seguridad Bronceado YNR': 13,
  'Slow Sunday Chest Massage Oil': 5,
  'Secador MyHair Power 3500': 5,
  'Kit Alisado Beox Royal Gold 24K': 5,
  'Gel Metallic NB Leda N-002 Plata': 5,
  'Aceite Cutículas Tuti Fruti Limegirl': 8,
  'Pulidor Mini NB Leda Pack': 19,
  'Kit Podologia Inox 2 piezas': 10,
  'Pegamento Rhinestone Glue 20ml': 10,
  'Caja Organizadora 12 Grid Cristales Dorado': 6,
  'Caja Organizadora 12 Grid Cristales Verde': 6,
  'YANMOSJ Parches Gel Ojos': 6,
  'Kit Cvian Lash Lift Permanente Pestañas': 4,
  'Estuche Pestañas Limpiador Rizador': 4,
  'Pack Moor EQ Key Ritual': 4,
  'Moor Snap Velvet Smooth Protect Spray 200ml': 4,
  'Moor EQ Key Force Oil': 4,
  'RISFORT Gel Fijador Extrafuerte 200ml': 4,
  'SAGA PRO BTX Effect Relleno Capilar': 2,
  'Pack Post Alisado Oyster Cutinol Plus': 6,
};

async function redisGet(url, token, key) {
  const r = await fetch(`${url}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const d = await r.json();
  return d.result ? parseInt(d.result) : 0;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const url   = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    // Sin KV configurado, devuelve stock inicial completo
    return res.json(INITIAL_STOCK);
  }

  const stock = {};
  await Promise.all(
    Object.entries(INITIAL_STOCK).map(async ([name, initial]) => {
      const sold = await redisGet(url, token, `sold:${name}`);
      stock[name] = Math.max(0, initial - sold);
    })
  );

  res.json(stock);
};
