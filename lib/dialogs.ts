import type { DialogTree } from './game-state';

// ─── Diálogo de introducción con Kimi ─────────────────────────────────────────
// Se ejecuta cuando el jugador entra a /juego3d por primera vez.

export const DIALOG_INTRO: DialogTree = {
  id: 'intro',
  startId: 'kimi-01',
  nodes: [
    {
      id: 'kimi-01',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Bienvenido, caminante. Soy Kimi, el guardián de la Sierra Norte de Oaxaca.',
      nextId: 'kimi-02',
    },
    {
      id: 'kimi-02',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Estas montañas guardan la memoria de cinco comunidades zapotecas y mixtecas.',
      nextId: 'kimi-03',
    },
    {
      id: 'kimi-03',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Tu misión es conocerlas, aprender de su lengua, su gobierno y sus luchas.',
      nextId: 'kimi-choice',
    },
    {
      id: 'kimi-choice',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: '¿Estás listo para comenzar el viaje?',
      choices: [
        { text: '¡Sí, vamos!',           nextId: 'kimi-yes' },
        { text: '¿De qué se trata todo?', nextId: 'kimi-explain' },
      ],
    },
    {
      id: 'kimi-explain',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Cada comunidad tiene retos de conocimiento. Respóndelos y ganarás puntos que te subirán en el ranking.',
      nextId: 'kimi-yes',
    },
    {
      id: 'kimi-yes',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: '¡Excelente! Comencemos por Capulalpam de Méndez. Sígueme al mapa de la Sierra.',
      nextId: null,
      onComplete: 'intro-kimi',
    },
  ],
};

// ─── Diálogo de cada comunidad (bienvenida del jaguar) ────────────────────────

export const DIALOG_CAPULALPAM: DialogTree = {
  id: 'capulalpam-intro',
  startId: 'cap-01',
  nodes: [
    {
      id: 'cap-01',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Capulalpam de Méndez. A 67 km de la ciudad de Oaxaca, en el Distrito de Ixtlán.',
      nextId: 'cap-02',
    },
    {
      id: 'cap-02',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Aquí el turismo lo controla la asamblea comunitaria. Nadie llega sin permiso del pueblo.',
      nextId: 'cap-03',
    },
    {
      id: 'cap-03',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Su problema más grande: los inversionistas externos quieren apoderarse del territorio. ¿Comenzamos el reto?',
      nextId: null,
      onComplete: 'capulalpam-quest',
    },
  ],
};

export const DIALOG_CHICOMEZUCHIL: DialogTree = {
  id: 'chicomezuchil-intro',
  startId: 'chi-01',
  nodes: [
    {
      id: 'chi-01',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'San Juan Chicomezuchil. Aquí el Zapoteco no es solo tradición — es el idioma de todos los días.',
      nextId: 'chi-02',
    },
    {
      id: 'chi-02',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'El tequio es obligatorio. La asamblea decide todo. Los jóvenes crecen aprendiendo a servir a su comunidad.',
      nextId: 'chi-03',
    },
    {
      id: 'chi-03',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Pero muchos jóvenes se van a la ciudad por falta de universidad. ¿Puedes demostrar que conoces su historia?',
      nextId: null,
    },
  ],
};

export const DIALOG_HUAMUCHIL: DialogTree = {
  id: 'huamuchil-intro',
  startId: 'hua-01',
  nodes: [
    {
      id: 'hua-01',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'El Huamuchil. Aquí el Mixteco ya casi no se escucha — solo las personas mayores lo hablan.',
      nextId: 'hua-02',
    },
    {
      id: 'hua-02',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Desde los años 80, miles de familias emigraron a California y Washington buscando trabajo.',
      nextId: 'hua-03',
    },
    {
      id: 'hua-03',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'El reto aquí es retener a las personas con proyectos productivos. ¿Conoces bien esta comunidad?',
      nextId: null,
    },
  ],
};

export const DIALOG_GUELATAO: DialogTree = {
  id: 'guelatao-intro',
  startId: 'gue-01',
  nodes: [
    {
      id: 'gue-01',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Guelatao de Juárez. Esta laguna vio nacer a Benito Juárez, el único presidente indígena de México.',
      nextId: 'gue-02',
    },
    {
      id: 'gue-02',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Hoy el pueblo enfrenta escasez de agua y falta de servicios médicos, pese a ser tierra de un gran símbolo.',
      nextId: 'gue-03',
    },
    {
      id: 'gue-03',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Proteger los manantiales es la propuesta del pueblo. ¿Estás listo para su reto?',
      nextId: null,
    },
  ],
};

export const DIALOG_LACHIRIOAG: DialogTree = {
  id: 'lachirioag-intro',
  startId: 'lach-01',
  nodes: [
    {
      id: 'lach-01',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'San Cristóbal Lachirioag. El Xhon Zapoteco vive aquí — toda la población lo habla.',
      nextId: 'lach-02',
    },
    {
      id: 'lach-02',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'Cada ciudadano cumple seis cargos a lo largo de su vida. El servicio comunitario no es opcional — es identidad.',
      nextId: 'lach-03',
    },
    {
      id: 'lach-03',
      speaker: 'jaguar',
      speakerName: 'Kimi',
      text: 'El cerro sagrado Yiawiz custodia esta comunidad desde tiempos prehispánicos. ¿Conoces sus secretos?',
      nextId: null,
    },
  ],
};

// Mapa de árbol de diálogos por comunidad (nivel → dialogTree)
export const COMMUNITY_DIALOGS: Record<number, DialogTree> = {
  1: DIALOG_CAPULALPAM,
  2: DIALOG_CHICOMEZUCHIL,
  3: DIALOG_HUAMUCHIL,
  4: DIALOG_GUELATAO,
  5: DIALOG_LACHIRIOAG,
};

export function getDialogById(id: string): DialogTree | undefined {
  if (id === 'intro') return DIALOG_INTRO;
  const entries = Object.values(COMMUNITY_DIALOGS);
  return entries.find((d) => d.id === id);
}
