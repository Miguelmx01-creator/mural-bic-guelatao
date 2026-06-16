// ─── Tipos base ────────────────────────────────────────────────────────────

export type CampoKey =
  | 'frase' | 'significado' | 'uso' | 'concepto'
  | 'derecho' | 'variante' | 'riesgo' | 'accion';

export type ComunidadDatos = Record<CampoKey, string>;

export type ComunidadInfo = {
  nivel:  number;
  nombre: string;
  emoji:  string;
  color:  string;
  datos:  ComunidadDatos;
};

// ─── Temas del 2° parcial — Lenguas Indígenas BIC 01 Guelatao ──────────────
// Contenido basado en arena-jaguar-web y materiales del segundo semestre.

export const COMUNIDADES: ComunidadInfo[] = [
  {
    nivel: 1, nombre: 'Saludos e Identidad', emoji: '🗣️', color: '#F2C14E',
    datos: {
      frase:       'Padiux — saludo general (buenos días, tardes y noches)',
      significado: 'Nagallagchhu = hasta luego; Bi nziu = ¿cómo te llamas?; Nada nzia = yo me llamo',
      uso:         'Inicio y cierre de cualquier interacción cotidiana en la comunidad',
      concepto:    'Una lengua no solo comunica: también transmite identidad, memoria y formas de ver el mundo',
      derecho:     'Hablar en lengua indígena en cualquier espacio público o escolar es un derecho reconocido',
      variante:    'Zapoteco serrano, variante Sierra Norte (BIC 01 Guelatao de Juárez)',
      riesgo:      'La vergüenza lingüística provoca que los jóvenes dejen de hablar su lengua',
      accion:      'Usar la lengua para saludar y presentarse en el aula y con la familia',
    },
  },
  {
    nivel: 2, nombre: 'Permisos e Interacción Real', emoji: '🤝', color: '#2FB89A',
    datos: {
      frase:       'Frases para pedir permiso y comunicarse en situaciones escolares cotidianas',
      significado: 'Ga bi lhe = ¿de dónde eres?; Nada naka bi = yo soy de; Bal yizu = ¿cuántos años tienes?',
      uso:         'Interacciones reales en el aula, la comunidad y situaciones escolares formales',
      concepto:    'La lengua vive cuando se usa en situaciones reales, no solo en ceremonias o festividades',
      derecho:     'Los estudiantes tienen derecho a usar su lengua indígena en instituciones educativas',
      variante:    'Zapoteco serrano — las frases varían ligeramente entre comunidades de la Sierra Norte',
      riesgo:      'El desuso escolar limita la lengua al espacio doméstico y acelera su pérdida',
      accion:      'Integrar frases de permiso y presentación en la rutina escolar diaria',
    },
  },
  {
    nivel: 3, nombre: 'Variantes y Metodología Experto-Aprendiz', emoji: '📖', color: '#E5532E',
    datos: {
      frase:       'Forma registrada por el Experto — no existe una única forma correcta',
      significado: 'Variante lingüística: forma de hablar una lengua según la comunidad o región',
      uso:         'Reconocer que cada comunidad tiene su propia variante válida del zapoteco',
      concepto:    'Metodología Experto-Aprendiz: el hablante mayor orienta el aprendizaje sin imponer un estándar único',
      derecho:     'Todas las variantes lingüísticas tienen igual valor y deben respetarse sin jerarquías',
      variante:    'Múltiples variantes del Zapoteco serrano coexisten en la Sierra Norte de Oaxaca',
      riesgo:      'Imponer una sola variante como correcta desvaloriza las demás y debilita la diversidad lingüística',
      accion:      'Escuchar al Experto-Aprendiz sin corregir su variante; documentar con respeto',
    },
  },
  {
    nivel: 4, nombre: 'Derechos Lingüísticos', emoji: '⚖️', color: '#9BB8D4',
    datos: {
      frase:       'Las lenguas indígenas son lenguas nacionales con la misma validez jurídica que el español',
      significado: 'Ley General de Derechos Lingüísticos (2003) — dio origen al INALI',
      uso:         'Marco legal para proteger el uso de lenguas indígenas en trámites y servicios públicos',
      concepto:    'Discriminación lingüística: negar atención o burlarse de quien habla su lengua es una violación de derechos',
      derecho:     'Art. 2° Constitucional + Ley General de Derechos Lingüísticos + Convenio 169 OIT (1989)',
      variante:    'Aplica a las 68 agrupaciones lingüísticas de México y sus más de 364 variantes',
      riesgo:      'La discriminación lingüística en instituciones provoca vergüenza y abandono de la lengua',
      accion:      'Exigir atención en lengua indígena en trámites, escuelas y servicios de salud',
    },
  },
  {
    nivel: 5, nombre: 'Comunidad y Revitalización', emoji: '🌱', color: '#2FB89A',
    datos: {
      frase:       'Revitalizar una lengua es fortalecerla mediante enseñanza, grabaciones y participación comunitaria',
      significado: 'Desplazamiento lingüístico: proceso por el que una comunidad abandona su lengua en favor de otra',
      uso:         'Estrategias comunitarias para recuperar el uso cotidiano de la lengua entre jóvenes',
      concepto:    'Transmisión intergeneracional: los padres y abuelos enseñan la lengua a las nuevas generaciones',
      derecho:     'Las comunidades tienen derecho a transmitir su lengua, cultura e identidad a futuras generaciones',
      variante:    'Zapoteco, Mixteco, Mixe y Chinanteco: familias lingüísticas de la Sierra Norte de Oaxaca',
      riesgo:      'La interrupción de la transmisión intergeneracional es la principal causa de muerte de una lengua',
      accion:      'Misión Palabras que Viven: documentar palabras y frases con personas mayores de la comunidad',
    },
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const LABELS: Record<CampoKey, string> = {
  frase:       'Frase en zapoteco',
  significado: 'Significado',
  uso:         'Contexto de uso',
  concepto:    'Concepto clave',
  derecho:     'Derecho lingüístico',
  variante:    'Variante / lengua',
  riesgo:      'Factor de riesgo',
  accion:      'Acción revitalizadora',
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

// ─── Tipo 3: Speed