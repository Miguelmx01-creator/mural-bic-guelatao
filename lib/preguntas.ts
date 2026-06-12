// ─── Tipos base ────────────────────────────────────────────────────────────

export type CampoKey =
  | 'lengua' | 'ubicacion' | 'gobierno' | 'fiesta'
  | 'gastronomia' | 'ambiente' | 'problema' | 'propuesta';

export type ComunidadDatos = Record<CampoKey, string>;

export type ComunidadInfo = {
  nivel:  number;
  nombre: string;
  emoji:  string;
  color:  string;
  datos:  ComunidadDatos;
};

// ─── Datos de las 5 comunidades ────────────────────────────────────────────

export const COMUNIDADES: ComunidadInfo[] = [
  {
    nivel: 1, nombre: 'Capulalpam de Méndez', emoji: '🏔️', color: '#F2C14E',
    datos: {
      lengua:      'Zapoteco (pocos hablantes activos)',
      ubicacion:   'Distrito de Ixtlán de Juárez, 67 km de Oaxaca',
      gobierno:    'Usos y costumbres, proyectos comunales en asamblea',
      fiesta:      'San Mateo Apóstol y Evangelista, 10 de septiembre',
      gastronomia: 'Jaripeo, baile popular, eventos deportivos en la fiesta',
      ambiente:    'Turismo comunitario controlado por la asamblea',
      problema:    'Sobreturismo e invasión de inversionistas externos',
      propuesta:   'Mantener control comunal sobre proyectos turísticos',
    },
  },
  {
    nivel: 2, nombre: 'Chicomezuchil', emoji: '🌿', color: '#2FB89A',
    datos: {
      lengua:      'Zapoteco (lengua principal)',
      ubicacion:   'San Juan Chicomezuchil, Sierra Norte',
      gobierno:    'Usos y costumbres, asamblea comunitaria, tequio obligatorio',
      fiesta:      'Sin dato registrado',
      gastronomia: 'Sin dato registrado',
      ambiente:    'Familia como base, varias generaciones conviven',
      problema:    'Migración de jóvenes a Oaxaca, CDMX o USA por falta de universidad',
      propuesta:   'Educación accesible para evitar la migración forzada',
    },
  },
  {
    nivel: 3, nombre: 'El Huamuchil', emoji: '🌽', color: '#E5532E',
    datos: {
      lengua:      'Mixteco variante baja (solo personas mayores)',
      ubicacion:   'Santiago Amoltepec, Sola de Vega, 234 km de Oaxaca',
      gobierno:    'Usos y costumbres, ciudadanos obligados a servir cargos',
      fiesta:      'Virgen de la Candelaria, febrero (basketball, calenda, jaripeo)',
      gastronomia: 'Caldo de res, rojo de pollo, tamal de calabaza, tepache de caña, mezcal',
      ambiente:    'Cerro mole, cerro del templo, 3 manantiales, clima 15-24°C',
      problema:    'Migración masiva desde 1980 hacia California y Washington',
      propuesta:   'Proyectos productivos para retener a las personas',
    },
  },
  {
    nivel: 4, nombre: 'Guelatao de Juárez', emoji: '⭐', color: '#F2C14E',
    datos: {
      lengua:      'Zapoteco (hablantes migraron, ya no es mayoría)',
      ubicacion:   'Municipio de Ixtlán de Juárez, 60 km de Oaxaca',
      gobierno:    'Ayuntamiento municipal, asambleas comunitarias participativas',
      fiesta:      'Copa Benito Juárez (torneo deportivo intercomunidades)',
      gastronomia: 'Sin dato específico registrado',
      ambiente:    'Laguna Encantada, bosques Sierra Juárez, senderos ecoturísticos',
      problema:    'Falta de médicos y hospitales especializados, falta de agua',
      propuesta:   'Proteger manantiales y mejorar distribución de agua',
    },
  },
  {
    nivel: 5, nombre: 'San Cristóbal Lachirioag', emoji: '🎶', color: '#2FB89A',
    datos: {
      lengua:      'Xhon del Zapoteco (100% de la población, forma oral)',
      ubicacion:   'Distrito de Villa Alta, 140 km de Oaxaca',
      gobierno:    'Sistema Normativo Interno, 6 cargos obligatorios por ciudadano',
      fiesta:      '19-25 de noviembre: calenda, danzas, basketball, fuegos artificiales',
      gastronomia: 'Caldo de res (nhiskuan), tamales de frijol con hoja de aguacate, tamal de tres picos, tepache dulce',
      ambiente:    '3 microclimas, 5 manantiales, Yiawiz cerro sagrado prehispánico',
      problema:    'Despoblación, migración, brecha digital generacional',
      propuesta:   'Talleres de oficios y espacios culturales para retener jóvenes',
    },
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const LABELS: Record<CampoKey, string> = {
  lengua:      'Lengua',
  ubicacion:   'Ubicación',
  gobierno:    'Gobierno',
  fiesta:      'Fiesta principal',
  gastronomia: 'Gastronomía',
  ambiente:    'Entorno natural',
  problema:    'Problema principal',
  propuesta:   'Propuesta de mejora',
};

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function reales(datos: ComunidadDatos): CampoKey[] {
  return (Object.keys(datos) as CampoKey[]).filter(k => !datos[k].includes('Sin dato'));
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

// ─── Tipo 1: ¿De qué comunidad es? ─────────────────────────────────────────

export type PreguntaComunidadQuiz = {
  tipo:              'comunidad-quiz';
  labelDato:         string;
  dato:              string;
  respuestaCorrecta: string;
  opciones:          string[]; // 4 nombres, barajados
};

export function generarComunidadQuiz(nivel: number): PreguntaComunidadQuiz {
  const com  = COMUNIDADES[nivel - 1];
  const campo = shuffle(reales(com.datos))[0];
  const otros = shuffle(COMUNIDADES.filter(c => c.nivel !== nivel).map(c => c.nombre)).slice(0, 3);
  return {
    tipo:              'comunidad-quiz',
    labelDato:         LABELS[campo],
    dato:              trunc(com.datos[campo], 120),
    respuestaCorrecta: com.nombre,
    opciones:          shuffle([...otros, com.nombre]),
  };
}

// ─── Tipo 2: El Impostor ────────────────────────────────────────────────────

export type ItemImpostor = {
  label:             string;
  valor:             string;
  esImpostor:        boolean;
  comunidadImpostor?: string;
};

export type PreguntaImpostor = {
  tipo:          'impostor';
  comunidadBase: string;
  items:         ItemImpostor[];
};

export function generarImpostor(nivel: number): PreguntaImpostor {
  const com    = COMUNIDADES[nivel - 1];
  const campos = shuffle(reales(com.datos)).slice(0, 3);
  const usados = new Set(campos);

  let impostorLabel    = '';
  let impostorValor    = '';
  let impostorComunidad = '';

  for (const otra of shuffle(COMUNIDADES.filter(c => c.nivel !== nivel))) {
    const disponibles = reales(otra.datos).filter(k => !usados.has(k));
    if (disponibles.length > 0) {
      const k          = shuffle(disponibles)[0];
      impostorLabel    = LABELS[k];
      impostorValor    = trunc(otra.datos[k], 90);
      impostorComunidad = otra.nombre;
      break;
    }
  }

  return {
    tipo:          'impostor',
    comunidadBase: com.nombre,
    items: shuffle([
      ...campos.map(k => ({
        label:      LABELS[k],
        valor:      trunc(com.datos[k], 90),
        esImpostor: false,
      })),
      {
        label:             impostorLabel,
        valor:             impostorValor,
        esImpostor:        true,
        comunidadImpostor: impostorComunidad,
      },
    ]),
  };
}

// ─── Tipo 3: Speed Sierra ───────────────────────────────────────────────────

export type PreguntaVelocidad = {
  label:     string;
  valor:     string;
  respuesta: boolean; // true = Sí, false = No
};

export type PreguntaSpeed = {
  tipo:      'speed-sierra';
  comunidad: string;
  preguntas: PreguntaVelocidad[];
};

export function generarSpeedSierra(nivel: number): PreguntaSpeed {
  const com   = COMUNIDADES[nivel - 1];
  const otras = COMUNIDADES.filter(c => c.nivel !== nivel);

  // 3 verdaderas
  const verdaderas: PreguntaVelocidad[] = shuffle(reales(com.datos))
    .slice(0, 3)
    .map(k => ({ label: LABELS[k], valor: trunc(com.datos[k], 70), respuesta: true }));

  // 2 falsas (mismo campo pero valor de otra comunidad)
  const falsas: PreguntaVelocidad[] = [];
  for (const campo of shuffle(reales(com.datos))) {
    if (falsas.length >= 2) break;
    const candidatos = otras.filter(o => !o.datos[campo].includes('Sin dato'));
    if (candidatos.length === 0) continue;
    const otra = shuffle(candidatos)[0];
    falsas.push({
      label:     LABELS[campo],
      valor:     trunc(otra.datos[campo], 70),
      respuesta: false,
    });
  }

  return {
    tipo:      'speed-sierra',
    comunidad: com.nombre,
    preguntas: shuffle([...verdaderas, ...falsas]).slice(0, 5),
  };
}
