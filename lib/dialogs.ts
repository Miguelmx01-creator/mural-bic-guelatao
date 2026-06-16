import type { DialogTree } from './game-state';

// ─── Diálogo de introducción — 2° Parcial Lenguas Indígenas ──────────────────
// Se ejecuta cuando el jugador entra a /juego3d por primera vez.

export const DIALOG_INTRO: DialogTree = {
  id: 'intro',
  startId: 'intro-01',
  nodes: [
    {
      id: 'intro-01',
      speaker: 'narrator',
      speakerName: 'La Sierra',
      text: 'Bienvenido al recorrido del 2° parcial de Lenguas Indígenas — BIC 01 Guelatao de Juárez.',
      nextId: 'intro-02',
    },
    {
      id: 'intro-02',
      speaker: 'narrator',
      speakerName: 'La Sierra',
      text: 'En este territorio conviven el Zapoteco, el Mixteco, el Mixe y el Chinanteco — lenguas vivas que guardan la memoria de la Sierra Norte.',
      nextId: 'intro-03',
    },
    {
      id: 'intro-03',
      speaker: 'narrator',
      speakerName: 'La Sierra',
      text: 'Recorrerás cinco estaciones: Saludos, Interacción, Variantes, Derechos y Revitalización.',
      nextId: 'intro-choice',
    },
    {
      id: 'intro-choice',
      speaker: 'narrator',
      speakerName: 'La Sierra',
      text: '¿Estás listo para demostrar lo que aprendiste este parcial?',
      choices: [
        { text: '¡Sí, empecemos!',          nextId: 'intro-yes' },
        { text: '¿Cómo funciona el juego?',  nextId: 'intro-explain' },
      ],
    },
    {
      id: 'intro-explain',
      speaker: 'narrator',
      speakerName: 'La Sierra',
      text: 'Cada estación tiene tres rondas: identificar temas, detectar el impostor y responder a velocidad. Acumula puntos para subir en el ranking.',
      nextId: 'intro-yes',
    },
    {
      id: 'intro-yes',
      speaker: 'narrator',
      speakerName: 'La Sierra',
      text: '¡Adelante! Selecciona una estación en el mapa para comenzar.',
      nextId: null,
      onComplete: 'intro-kimi',
    },
  ],
};

// ─── Diálogo de cada estación (tema del parcial) ──────────────────────────────

export const DIALOG_SALUDOS: DialogTree = {
  id: 'saludos-intro',
  startId: 'sal-01',
  nodes: [
    {
      id: 'sal-01',
      speaker: 'narrator',
      speakerName: 'Estación 1',
      text: 'Saludos e Identidad. Padiux es el saludo general del zapoteco serrano — funciona en cualquier momento del día.',
      nextId: 'sal-02',
    },
    {
      id: 'sal-02',
      speaker: 'narrator',
      speakerName: 'Estación 1',
      text: 'Una lengua no solo comunica: también transmite identidad, memoria y formas de ver el mundo.',
      nextId: 'sal-03',
    },
    {
      id: 'sal-03',
      speaker: 'narrator',
      speakerName: 'Estación 1',
      text: 'Recuerda las frases de presentación: Bi nziu, Nada nzia, Ga bi lhe, Nada naka bi. ¿Listo para el reto?',
      nextId: null,
    },
  ],
};

export const DIALOG_PERMISOS: DialogTree = {
  id: 'permisos-intro',
  startId: 'per-01',
  nodes: [
    {
      id: 'per-01',
      speaker: 'narrator',
      speakerName: 'Estación 2',
      text: 'Permisos e Interacción Real. La lengua vive cuando se usa en situaciones cotidianas, no solo en clase.',
      nextId: 'per-02',
    },
    {
      id: 'per-02',
      speaker: 'narrator',
      speakerName: 'Estación 2',
      text: 'Los estudiantes tienen derecho a usar su lengua indígena dentro de las instituciones educativas.',
      nextId: 'per-03',
    },
    {
      id: 'per-03',
      speaker: 'narrator',
      speakerName: 'Estación 2',
      text: 'El desuso escolar es uno de los factores que más acelera la pérdida de una lengua. ¿Conoces bien este tema?',
      nextId: null,
    },
  ],
};

export const DIALOG_VARIANTES: DialogTree = {
  id: 'variantes-intro',
  startId: 'var-01',
  nodes: [
    {
      id: 'var-01',
      speaker: 'narrator',
      speakerName: 'Estación 3',
      text: 'Variantes y Metodología Experto-Aprendiz. No existe una sola forma correcta — cada comunidad tiene su variante válida.',
      nextId: 'var-02',
    },
    {
      id: 'var-02',
      speaker: 'narrator',
      speakerName: 'Estación 3',
      text: 'El Experto orienta el aprendizaje sin imponer un estándar único. La escucha respetuosa es la base de la metodología.',
      nextId: 'var-03',
    },
    {
      id: 'var-03',
      speaker: 'narrator',
      speakerName: 'Estación 3',
      text: 'Imponer una variante como superior desvaloriza la diversidad lingüística. ¿Puedes identificar los conceptos clave?',
      nextId: null,
    },
  ],
};

export const DIALOG_DERECHOS: DialogTree = {
  id: 'derechos-intro',
  startId: 'der-01',
  nodes: [
    {
      id: 'der-01',
      speaker: 'narrator',
      speakerName: 'Estación 4',
      text: 'Derechos Lingüísticos. La Ley General de Derechos Lingüísticos (2003) reconoce las lenguas indígenas como lenguas nacionales.',
      nextId: 'der-02',
    },
    {
      id: 'der-02',
      speaker: 'narrator',
      speakerName: 'Estación 4',
      text: 'El Convenio 169 de la OIT (1989), el Artículo 2° Constitucional y la Declaración ONU forman el marco de protección internacional.',
      nextId: 'der-03',
    },
    {
      id: 'der-03',
      speaker: 'narrator',
      speakerName: 'Estación 4',
      text: 'Burlarse de quien habla su lengua es discriminación lingüística y viola esos derechos. ¿Conoces los marcos legales?',
      nextId: null,
    },
  ],
};

export const DIALOG_REVITALIZACION: DialogTree = {
  id: 'revitalizacion-intro',
  startId: 'rev-01',
  nodes: [
    {
      id: 'rev-01',
      speaker: 'narrator',
      speakerName: 'Estación 5',
      text: 'Comunidad y Revitalización. La transmisión intergeneracional es el mecanismo más poderoso para mantener una lengua viva.',
      nextId: 'rev-02',
    },
    {
      id: 'rev-02',
      speaker: 'narrator',
      speakerName: 'Estación 5',
      text: 'El desplazamiento lingüístico ocurre cuando una comunidad abandona su lengua en favor de otra más dominante.',
      nextId: 'rev-03',
    },
    {
      id: 'rev-03',
      speaker: 'narrator',
      speakerName: 'Estación 5',
      text: 'Misión Palabras que Viven: documentar palabras con personas mayores es un acto de revitalización. ¿Demuestras lo aprendido?',
        nextId: null,
    },
  ],
};

// Mapa de árbol de diálogos por estación (nivel → dialogTree)
export const COMMUNITY_DIALOGS: Record<number, DialogTree> = {
  1: DIALOG_SALUDOS,
  2: DIALOG_PERMISOS,
  3: DIALOG_VARIANTES,
  4: DIALOG_DERECHOS,
  5: DIALOG_REVITALIZACION,
};

export function getDialogById(id: string): DialogTree | undefined {
  if (id === 'intro') return DIALOG_INTRO;
  const entries = Object.values(COMMUNITY_DIALOGS);
  return entries.find((d) => d.id === id);
}
