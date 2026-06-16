// ─── Tipos base ────────────────────────────────────────────────────────────

export type CampoKey =
  | 'frase' | 'significado' | 'uso' | 'concepto'
  | 'derecho' | 'variante' | 'riesgo' | 'accion'
  | 'ejemplo' | 'norma' | 'actor' | 'dato';

export type ComunidadDatos = Record<CampoKey, string>;

export type ComunidadInfo = {
  nivel:  number;
  nombre: string;
  emoji:  string;
  color:  string;
  datos:  ComunidadDatos;
};

// ─── Temas del 2° parcial — Lenguas Indígenas BIC 01 Guelatao ──────────────

export const COMUNIDADES: ComunidadInfo[] = [
  {
    nivel: 1, nombre: 'Saludos e Identidad', emoji: '🗣️', color: '#F2C14E',
    datos: {
      frase:       'Padiux — saludo general del zapoteco serrano (funciona en cualquier momento del día)',
      significado: 'Nagallagchhu = hasta luego; Bi nziu = ¿cómo te llamas?; Nada nzia = yo me llamo',
      uso:         'Inicio y cierre de cualquier interacción cotidiana en la comunidad de la Sierra Norte',
      concepto:    'Una lengua no solo comunica: también transmite identidad, memoria y cosmovisión',
      derecho:     'Hablar en lengua indígena en cualquier espacio público o escolar es un derecho reconocido',
      variante:    'Zapoteco serrano, variante Sierra Norte de Oaxaca (BIC 01 Guelatao de Juárez)',
      riesgo:      'La vergüenza lingüística (language shame) provoca que los jóvenes abandonen su lengua',
      accion:      'Usar saludos en lengua indígena en el aula y con la familia de manera cotidiana',
      ejemplo:     'Abrir cada clase con "Padiux" crea hábito e identidad lingüística colectiva en el grupo',
      norma:       'Constitución Mexicana, Art. 2° — protege la identidad cultural y lingüística de los pueblos indígenas',
      actor:       'BIC (Bachillerato Integral Comunitario): modelo educativo que integra lengua e identidad local',
      dato:        'El 68% de jóvenes hablantes de lengua indígena en México son bilingües, pero el 30% no la transmite a sus hijos',
    },
  },
  {
    nivel: 2, nombre: 'Permisos e Interacción Real', emoji: '🤝', color: '#2FB89A',
    datos: {
      frase:       'Frases para pedir permiso y presentarse en situaciones escolares cotidianas en zapoteco',
      significado: 'Ga bi lhe = ¿de dónde eres?; Nada naka bi = yo soy de…; Bal yizu = ¿cuántos años tienes?',
      uso:         'Interacciones reales en el aula, la comunidad y espacios escolares formales e informales',
      concepto:    'La lengua vive cuando se practica en situaciones reales, no solo en ceremonias o festividades',
      derecho:     'Los estudiantes tienen derecho a usar su lengua indígena dentro de las instituciones educativas',
      variante:    'Zapoteco serrano — las frases varían ligeramente entre comunidades de la Sierra Norte',
      riesgo:      'El desuso escolar restringe la lengua al espacio doméstico y acelera el desplazamiento lingüístico',
      accion:      'Incorporar frases de permiso y presentación en la rutina escolar diaria del BIC',
      ejemplo:     'Actividad práctica: presentarse con nombre y comunidad de origen en zapoteco ante el grupo',
      norma:       'LGDL, Art. 11 — reconoce el derecho a educación intercultural bilingüe en lengua materna',
      actor:       'Maestro o maestra bilingüe comunitaria: mediador entre la lengua y los espacios institucionales',
      dato:        'Solo el 7.2% de escuelas indígenas de México ofrece educación realmente bilingüe (INEE, 2018)',
    },
  },
  {
    nivel: 3, nombre: 'Variantes y Metodología Experto-Aprendiz', emoji: '📖', color: '#E5532E',
    datos: {
      frase:       'Forma registrada en sesión Experto-Aprendiz — no existe una única forma correcta de hablar',
      significado: 'Variante lingüística: forma particular de una lengua según la comunidad o región hablante',
      uso:         'Reconocer que cada comunidad tiene su propia variante válida, sin jerarquías entre ellas',
      concepto:    'Metodología Experto-Aprendiz: el hablante mayor orienta el aprendizaje sin imponer un estándar',
      derecho:     'Todas las variantes lingüísticas tienen igual valor jurídico y cultural; ninguna es superior',
      variante:    'El Zapoteco tiene más de 60 variantes documentadas solo en el estado de Oaxaca',
      riesgo:      'Estandarizar una variante como "correcta" desvaloriza las demás y divide la comunidad lingüística',
      accion:      'Documentar la variante local con respeto, sin corregir al Experto durante la sesión de aprendizaje',
      ejemplo:     'En la sesión: el aprendiz escucha y registra; el Experto habla naturalmente sin ser evaluado',
      norma:       'UNESCO (2003) — "Vitalidad y peligro de desaparición de las lenguas": valora la diversidad de variantes',
      actor:       'Experto-Aprendiz: el hablante nativo mayor que comparte su variante sin imposición pedagógica',
      dato:        'El Zapoteco es la segunda lengua indígena más hablada en Oaxaca, con aproximadamente 400,000 hablantes',
    },
  },
  {
    nivel: 4, nombre: 'Derechos Lingüísticos', emoji: '⚖️', color: '#9BB8D4',
    datos: {
      frase:       'Las lenguas indígenas son lenguas nacionales con la misma validez jurídica que el español',
      significado: 'Ley General de Derechos Lingüísticos (LGDL, 2003) — creó el INALI como institución garante',
      uso:         'Marco legal para proteger el uso de lenguas indígenas en trámites, salud y servicios públicos',
      concepto:    'Discriminación lingüística: negar atención o burlarse de quien habla su lengua es violación de DDHH',
      derecho:     'Art. 2° Constitucional + Ley General de Derechos Lingüísticos + Convenio 169 OIT (1989)',
      variante:    'La LGDL aplica a las 68 agrupaciones lingüísticas y más de 364 variantes de todo México',
      riesgo:      'La discriminación en escuelas y servicios de salud genera vergüenza y abandono de la lengua propia',
      accion:      'Exigir atención en lengua indígena en trámites escolares, de salud y ante autoridades civiles',
      ejemplo:     'Caso real: cualquier hablante puede solicitar intérprete en un proceso jurídico en México',
      norma:       'Declaración ONU sobre Derechos Pueblos Indígenas (2007), Art. 13 — protege lengua y transmisión',
      actor:       'INALI (Instituto Nacional de Lenguas Indígenas): organismo federal que documenta y protege las 68 lenguas',
      dato:        'México reconoce 68 lenguas nacionales indígenas, siendo uno de los países más plurilingüísticos del mundo',
    },
  },
  {
    nivel: 5, nombre: 'Comunidad y Revitalización', emoji: '🌱', color: '#2FB89A',
    datos: {
      frase:       'Revitalizar una lengua es fortalecerla mediante enseñanza, grabaciones y participación comunitaria',
      significado: 'Desplazamiento lingüístico: proceso por el que una comunidad abandona su lengua por otra dominante',
      uso:         'Estrategias comunitarias y escolares para recuperar el uso cotidiano entre jóvenes y niños',
      concepto:    'Transmisión intergeneracional: mecanismo por el que padres y abuelos enseñan la lengua a los hijos',
      derecho:     'Las comunidades tienen derecho colectivo a transmitir su lengua y cosmovisión a futuras generaciones',
      variante:    'Zapoteco, Mixteco, Mixe y Chinanteco: principales familias lingüísticas de la Sierra Norte de Oaxaca',
      riesgo:      'Interrumpir la transmisión intergeneracional es la principal causa documentada de muerte lingüística',
      accion:      'Misión Palabras que Viven: documentar vocabulario y frases con personas mayores de la comunidad',
      ejemplo:     'Proyecto real: grabar a abuelos narrar historias o canciones en zapoteco para archivar y enseñar',
      norma:       'Plan Nacional de Revitalización de Lenguas Indígenas (INALI, 2008): estrategia nacional de recuperación',
      actor:       'Nidos de lengua: espacios comunitarios donde niños aprenden la lengua de hablantes mayores de forma natural',
      dato:        'De las 68 lenguas nacionales de México, al menos 21 están en riesgo crítico de desaparición (INALI, 2023)',
    },
  }
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const LABELS: Record<CampoKey, string> = {
  frase:       'Frase / nombre en la lengua',
  significado: 'Significado',
  uso:         'Contexto de uso',
  concepto:    'Concepto clave',
  derecho:     'Derecho lingüístico',
  variante:    'Variante / familia lingüística',
  riesgo:      'Factor de riesgo',
  accion:      'Acción revitalizadora',
  ejemplo:     'Ejemplo práctico',
  norma:       'Norma o instrumento legal',
  actor:       'Actor / organismo clave',
  dato:        'Dato estadístico',
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

// ─── Tipo 1: ¿A qué estación pertenece? ────────────────────────────────────

export type PreguntaComunidadQuiz = {
  tipo:              'comunidad-quiz';
  labelDato:         string;
  dato:              string;
  respuestaCorrecta: string;
  opciones:          string[];
};

export function generarComunidadQuiz(nivel: number): PreguntaComunidadQuiz {
  const com   = COMUNIDADES[nivel - 1];
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

  let impostorLabel     = '';
  let impostorValor     = '';
  let impostorComunidad = '';

  for (const otra of shuffle(COMUNIDADES.filter(c => c.nivel !== nivel))) {
    const disponibles = reales(otra.datos).filter(k => !usados.has(k));
    if (disponibles.length > 0) {
      const k           = shuffle(disponibles)[0];
      impostorLabel     = LABELS[k];
      impostorValor     = trunc(otra.datos[k], 90);
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

// ─── Tipo 3: Speed Sierra (10 preguntas) ────────────────────────────────────

export type PreguntaVelocidad = {
  label:     string;
  valor:     string;
  respuesta: boolean;
};

export type PreguntaSpeed = {
  tipo:      'speed-sierra';
  comunidad: string;
  preguntas: PreguntaVelocidad[];
};

export function generarSpeedSierra(nivel: number): PreguntaSpeed {
  const com   = COMUNIDADES[nivel - 1];
  const otras = COMUNIDADES.filter(c => c.nivel !== nivel);

  // Hasta 6 verdaderas
  const verdaderas: PreguntaVelocidad[] = shuffle(reales(com.datos))
    .slice(0, 6)
    .map(k => ({ label: LABELS[k], valor: trunc(com.datos[k], 80), respuesta: true }));

  // Hasta 4 falsas
  const falsas: PreguntaVelocidad[] = [];
  for (const campo of shuffle(reales(com.datos))) {
    if (falsas.length >= 4) break;
    const candidatos = otras.filter(o => !o.datos[campo].includes('Sin dato'));
    if (candidatos.length === 0) continue;
    const otra = shuffle(candidatos)[0];
    falsas.push({
      label:     LABELS[campo],
      valor:     trunc(otra.datos[campo], 80),
      respuesta: false,
    });
  }

  return {
    tipo:      'speed-sierra',
    comunidad: com.nombre,
    preguntas: shuffle([...verdaderas, ...falsas]).slice(0, 10),
  };
}
