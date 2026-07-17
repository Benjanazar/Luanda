const INITIAL_STOCK = {
  // HERRAMIENTAS
  'Set 8 piezas para máquina de afeitar': 3,
  'Plancha Titanium a.g.v Inspire': 1,
  'Cepillo Pala de Madera': 1,
  'Rizador Ceramic Curling Iron 3 barriles': 4,
  'Tenacilla Curling Iron Cerámica': 1,
  'Cepillo Leopardo Rojo': 2,
  'Soporte Teléfono Conejo Rosa': 4,
  'Secador MyHair Power 3500': 5,

  // CHAMPÚS
  'Champú Fanola Nourishing 350 ml': 3,
  'Champú Fanola No Yellow 350ml': 2,
  'Champú Sin Sal Liheto 500 ml': 12,
  'Champú Power Hair Hey Joe 250ml': 4,
  'Champú Purify Hair Hey Joe 250ml': 4,
  'Champú Argabeta Anticaída 500ml': 3,
  'Champú Scalp Control Glossco 250ml': 3,
  'Champú Reconstructivo Botugen Fanola': 4,

  // MASCARILLAS
  'Mascarilla Fanola Nourishing 500 ml': 2,
  'Mascarilla Granada 1000 ml': 1,
  'Mascarilla Anticaída Liding Kemon 200ml': 3,
  'Pack Post Alisado Oyster Cutinol Plus': 5,
  'Spray Perfect Volumen Glossco': 0,
  'Uniq ONE 10 Revlon': 3,
  'BI PHASE Smoothie Glossco': 3,
  'Pack Solar Wella INVIGO Sun Care': 4,

  // SERUMS
  'Serum Restructurante Fanola 100 ml': 6,
  'Serum Crystal Repair Glossco': 7,
  'Filler Botugen Fanola': 4,
  'Loción Elixir Anticaída Natural Cure': 5,
  'Loción Scalp Control Glossco 100ml': 3,

  // STYLING
  'Laca Ecológica Elegance Liheto': 8,

  // RIZOS
  'Crema Rizos Glossco Waves & Curls Plus': 1,
  'Espuma Curl Special Glossco': 2,

  // COLORACIÓN
  'Gummy Glow Biotin ESSENS': 1,
  'Activador de Melanina Diet Esthetic': 13,
  'Tinte Happy Fantasia 100ml': 13,
  'Emulsión Oxidante Oxi Gloss 75ml': 22,
  'Decoloración Deco Gloss 30gr': 13,
  'Bigen Tinte Permanente en Polvo': 4,

  // BELLEZA
  'Fortalecedor de Pestañas EELHOE': 2,
  'Laminado Cejas Essens Must Have Edition': 1,
  'Crema Manos Velvet Blossom Essens 30ml': 4,
  'Crema Manos Miyueleni': 27,
  'Eye Patches Age Reset Complex Essens': 17,
  'Crema de Pies Manteca de Cacao Boswellia Essens': 6,
  'Naturalis Sakura Bath Salt 1000g': 6,
  'Barra Hidratante Pies Slow Sunday 30g': 5,
  "Sérum Antiarrugas L'Oreal Revitalift": 4,
  'Must Have Edition Essens Beauty': 2,
  'SHEGLAM So Lippy Lip Liner': 4,
  'Rose Line Define Waterproof Eyeliner': 12,
  'Shadomagic Lash Shampoo': 3,
  'SHEGLAM Gel Fijador Cejas Set Me Up': 13,
  'SHEGLAM Limpiador Facial Brocha Piel Mixta 100ml': 6,
  'Yara Lattafa Estuche 30ml + Gloss': 1,
  'Yara Candy Lattafa EDP 100ml': 2,
  'Yara Moi Lattafa EDP 100ml': 1,
  'Yara Candy Lattafa EDP 35ml': 2,
  'Yara Moi Lattafa EDP 35ml': 1,
  'Lápiz Dermatográfico Mitsubishi 7600': 10,
  'Luz Nocturna Kuromi Luna Miniso': 2,
  'Lámpara Sal Cristal Himalayan': 2,
  'Slow Sunday Chest Massage Oil': 6,

  // BRONCEADO
  'Gafas Seguridad Bronceado YNR': 13,

  // UÑAS — Equipos y lámparas
  'Lámpara SUN BM-9 2/1 LED-UV 180W': 3,
  'Lámpara SUN L4 USB 24 LED': 1,
  'Lámpara UV LED Portátil Frescobaldi Pro': 2,
  'Kit Aerógrafo Rosa Recargable — Nail Art': 1,
  'Aspirador de Polvo para Manicura': 1,
  'NAIL POLISHER 45000 RPM': 1,
  'Torno Profesional Brillitos': 0,
  'Torno Portátil con Strass 45000 RPM': 1,
  'Aerógrafo Profesional Nail Art': 1,
  'Calentador de Cera Uxsiya': 1,
  'Removedor Callos Eléctrico Profesional': 2,
  'Recambios Removedor de Callos 60uds': 1,
  'Láser UV Antihongos Portátil ONLYNDS': 4,

  // UÑAS — Esmaltes y geles
  'Endurecedor Uñas Mussvital Essentials': 0,
  'Rubber Gel Ojo de Gato NB N-007': 8,
  'Rubber Gel Ojo de Gato Plata NB N-002': 8,
  'Rubber Gel Ojo de Gato Iris Plata NB N-005': 8,
  'Gel Metallic NB Leda N-002 Plata': 4,
  'Gel Polish Base NB 15ml': 6,
  'Ultra Top Coat NB 15ml': 6,
  'Ultra Top Coat NB 17ml': 2,
  'Matte Top Coat Getpolish 18ml': 1,
  'Primer No Ácido NB': 4,
  'Nail Prep Deshidratador Nailpop 15ml': 6,
  'Removedor de Gel XCUAYI 15ml': 2,
  'Nails Cleanser NB Leda 250ml': 20,
  'Monómero Profesional Secado Rápido NB 500ml': 19,
  'Monómero Profesional Mango NB 500ml': 11,
  'Acrílico Maquillage NB 200gr': 1,
  'Polvo Aurora Reflectante Holográfico': 20,
  'Xeijayi Painted Adhesive 01': 4,
  'Eyeliner Nail Art 2 Puntas': 4,

  // UÑAS — Herramientas y accesorios
  'Dosificador Espuma Uñas': 5,
  'Moldes Adhesivos Extensión Uñas 500uds': 8,
  'Pegamento Nail Tips': 12,
  'Tijeras Manicura Punta Curva NB Leda': 10,
  'Tijeras Cutículas Iridiscentes Titanio': 3,
  'Corta Cutículas Chapado Oro NB Leda': 10,
  'Cortaúñas Tips Acrílicas Rosa Fucsia': 2,
  'Juego de Brocas para Torno Profesional': 1,
  'Lima Pies Madera Doble Cara Pack 2': 5,
  'Medidor Tamaño Nail Tips': 8,
  'Pinza Precisión Vetus Acero Inox': 3,
  'Esponja Lima NB Leda 100/180 Pack 10': 2,
  'Pegamento Rhinestone Glue 20ml': 10,
  'Pegamento Strass Alta Viscosidad': 1,
  'Kolinsky Pinceles Germany Set 3': 10,
  'East Nails Pinceles Set 3': 7,
  'Set 5 Punteadoras Nail Art Rosa': 3,
  'Brocha Cerdas Rosa Mango Dorado': 3,
  'Pincel Gel Brillitos NB': 14,
  'Aceite Cutículas Tuti Fruti Limegirl': 8,
  'Caja Organizadora 12 Grid Cristales': 9,
  'Caja Organizadora 12 Grid Cristales Dorado': 6,
  'Caja Organizadora 12 Grid Cristales Rosa': 5,
  'Caja Organizadora 12 Grid Cristales Verde': 6,
  'Dijes Lazos Resina 3D Nail Art 30uds': 6,
  'Separador Dedos Silicona Pedicura': 4,
  'Palitos Naranjo Madera Manicura': 6,
  'Protector Alicates Silicona Gatito': 30,
  'Deditos de Silicona Nail Art': 4,
  'Pulidor Mini NB Leda Pack': 19,
  'Kit Podologia Inox 2 piezas': 10,

  // TRATAMIENTOS PREMIUM
  'Kit Alisado Beox Royal Gold 24K': 5,
  'Pack Moor EQ Key Ritual': 4,
  'Moor Snap Velvet Smooth Protect Spray 200ml': 4,
  'Moor EQ Key Force Oil': 4,
  'RISFORT Gel Fijador Extrafuerte 200ml': 4,
  'SAGA PRO BTX Effect Relleno Capilar': 2,
  'Kit Cvian Lash Lift Permanente Pestañas': 4,
  'Estuche Pestañas Limpiador Rizador': 4,
  'YANMOSJ Parches Gel Ojos': 6,
  'Secador Rápido de Uñas Risfort': 4,
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
