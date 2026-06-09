/**
 * seed-lachirioag.js
 * Inserta 8 tarjetas de ejemplo para San Cristóbal Lachirioag en Firestore.
 *
 * CONFIGURACIÓN ANTES DE CORRER:
 *   1. Asegúrate de que .env.local existe con FIREBASE_PROJECT_ID,
 *      FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY.
 *   2. Instala dotenv si no lo tienes:  npm install dotenv
 *   3. Ejecuta:  node scripts/seed-lachirioag.js
 *
 * IDEMPOTENCIA:
 *   Antes de insertar, borra todas las tarjetas cuyo autor sea
 *   "Ejemplo (Prof. Isaías)" y comunidadKey sea "San Cristóbal Lachirioag".
 *   Puedes correrlo varias veces sin duplicar.
 */

require('dotenv').config({ path: '.env.local' });

const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue }      = require('firebase-admin/firestore');

// ── Inicializar Admin SDK ──────────────────────────────────────────────────
const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId:   process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });

const db = getFirestore(app);

// ── Constantes ─────────────────────────────────────────────────────────────
const COMUNIDAD_RAW = 'San Cristóbal Lachirioag';
const COMUNIDAD_KEY = 'San Cristóbal Lachirioag'; // ya normalizada
const AUTOR         = 'Ejemplo (Prof. Isaías)';

// ── Tarjetas ───────────────────────────────────────────────────────────────
// Información extraída directamente de la monografía:
// "Historia y Vida actual de un Pueblo Zapoteca – San Cristóbal Lachirioag"
const TARJETAS = [
  {
    categoria: 'identidad-raices',
    titulo:    'Pueblo zapoteca de la Sierra Norte',
    descripcion:
      'San Cristóbal Lachirioag es un municipio zapoteca del distrito de Villa Alta, ' +
      'a 140 km de Oaxaca. Sus habitantes hablan la variante lingüística Xhon del Zapoteco, ' +
      'que se comparte desde la cordillera de San Miguel Cajonos hasta Lachirioag. ' +
      'El 100 % de la población domina el zapoteco de forma oral.',
  },
  {
    categoria: 'dimension-social',
    titulo:    'Migración: causas y consecuencias',
    descripcion:
      'Desde principios del siglo XX los pobladores emigran a la Ciudad de México, ' +
      'el norte del país y Estados Unidos (Los Ángeles, San José California). ' +
      'Esto ha mejorado la economía familiar pero también ha causado desintegración ' +
      'familiar, despoblación y abandono de terrenos de cultivo.',
  },
  {
    categoria: 'dimension-politica',
    titulo:    'Gobierno por usos y costumbres',
    descripcion:
      'El municipio se rige por el Sistema Normativo Interno (Usos y Costumbres). ' +
      'Cada ciudadano debe cumplir 6 cargos obligatorios a lo largo de su vida, sin ' +
      'cobrar dieta. Las autoridades son elegidas en asamblea general. ' +
      'En 1983 el pueblo destituyó a sus autoridades por irregularidades: un ejemplo ' +
      'histórico de autonomía comunitaria.',
  },
  {
    categoria: 'dimension-cultural',
    titulo:    'Fiesta patronal de San Cristóbal',
    descripcion:
      'La fiesta principal se celebra entre el 19 y 25 de noviembre. Incluye calenda, ' +
      'procesiones, danzas, torneo de basquetbol, juegos artificiales y baile regional ' +
      'con bandas filarmónicas. Los emigrados participan como padrinos enviando reses, ' +
      'premios y fuegos artificiales desde Estados Unidos.',
  },
  {
    categoria: 'dimension-cultural',
    titulo:    'Gastronomía y bebidas típicas',
    descripcion:
      'El platillo de fiesta es el caldo de res (nhiskuan) y los tamales de frijol con ' +
      'hoja de aguacate. El tamal de tres picos —de amarillo con carne de cerdo envuelto ' +
      'en hoja de plátano— es exclusivo de Lachirioag. Las bebidas tradicionales son ' +
      'el aguardiente local, el tepache dulce y el champurrado.',
  },
  {
    categoria: 'dimension-ambiental',
    titulo:    'Territorio: cerros, ríos y microclimas',
    descripcion:
      'La comunidad tiene tres microclimas: frío en las partes altas, templado en el centro ' +
      '(donde crece café, caña y maíz) y caliente en las partes bajas. ' +
      'Cuenta con 5 manantiales principales y varios arroyos. El Yiawiz: cerro de las Guayabinas, ' +
      'al poniente, es un sitio sagrado prehispánico donde se realizan ceremonias y rituales.',
  },
  {
    categoria: 'dimension-tecnologica',
    titulo:    'Conectividad y acceso a tecnología',
    descripcion:
      'El servicio telefónico domiciliario llegó en 2004. Algunas casas cuentan con ' +
      'computadoras e internet, pero la cobertura no es uniforme en toda la comunidad. ' +
      'El servicio telefónico domiciliario llegó en 2004. Hoy algunas casas tienen ' +
      'computadora e internet, pero la cobertura no es pareja en todo el pueblo: la señal ' +
      'de celular suele ser intermitente y se concentra en el centro. Los jóvenes la usan ' +
      'sobre todo para WhatsApp y redes sociales, mientras que los adultos mayores casi no, ' +
      'lo que marca una brecha digital entre generaciones.',
  },
  {
    categoria: 'problema-detectado',
    titulo:    'Despoblación por migración juvenil',
    descripcion:
      'En la comunidad existe una fuerte emigración de jóvenes hacia Estados Unidos y ' +
      'ciudades del país, afecta principalmente a las familias y a la comunidad entera, ' +
      'debido a la falta de fuentes de empleo y oportunidades de estudio locales, ' +
      'generando como consecuencia abandono de terrenos de cultivo, pérdida de músicos ' +
      'y líderes jóvenes, y debilitamiento del sistema de cargos.',
  },
  {
    categoria: 'propuesta-mejora',
    titulo:    'Propuesta para retener a los jóvenes',
    descripcion:
      'Crear proyectos productivos y educativos que den razones para quedarse: por ejemplo, talleres de oficios y de aprovechamiento de los recursos del monte (café, frutales, trabajo forestal) ligados al bachillerato, y espacios culturales y deportivos para la juventud. Tendrían que participar el BIC, las autoridades municipales y comunales, las familias y los emigrados organizados en mesas directivas, que ya apoyan obras del pueblo. La meta: que estudiar y trabajar en la comunidad sea una opción real, no solo la salida hacia la ciudad o Estados Unidos. [Tarjeta de muestra — confirma estos datos en tu propia comunidad.]',
  },
];

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const col = db.collection('tarjetas');

  // 1. Borrar tarjetas previas de este ejemplo (idempotencia)
  console.log('🔍  Buscando tarjetas de ejemplo anteriores...');
  const previas = await col
    .where('autor', '==', AUTOR)
    .where('comunidadKey', '==', COMUNIDAD_KEY)
    .get();

  if (!previas.empty) {
    const batch = db.batch();
    previas.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
    console.log(`🗑   Eliminadas ${previas.size} tarjeta(s) anteriores.`);
    console.log('⚠️  Si habías subido fotos a esas tarjetas de ejemplo, se perdieron. Vuelve a subirlas con el PIN del profesor.');
  } else {
    console.log('   No había tarjetas previas. Continuando...');
  }

  // 2. Insertar las nuevas
  console.log(`\n📝  Insertando ${TARJETAS.length} tarjetas...`);
  for (const t of TARJETAS) {
    await col.add({
      comunidadRaw: COMUNIDAD_RAW,
      comunidadKey: COMUNIDAD_KEY,
      categoria:    t.categoria,
      titulo:       t.titulo,
      descripcion:  t.descripcion,
      autor:        AUTOR,
      imagenUrl:    null,
      creadoEn:     FieldValue.serverTimestamp(),
    });
    console.log(`   ✅  [${t.categoria}] ${t.titulo}`);
  }

  console.log('\n🎉  ¡Listo! Las tarjetas ya están en Firestore.');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌  Error:', err);
  process.exit(1);
});
