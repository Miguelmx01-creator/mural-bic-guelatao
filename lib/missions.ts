import type { Mission } from './game-state';

// Una misión introductoria + una por cada comunidad de la Sierra Norte.
// Las misiones se desbloquean secuencialmente siguiendo el mapa de niveles.

export const MISSIONS_DATA: Mission[] = [
  // ── Misión 0: Introducción ──────────────────────────────────────────────
  {
    id: 'intro-kimi',
    title: 'El Guardián Despierta',
    description: 'Kimi, el jaguar guardián de la Sierra Norte, te ha encontrado. Escúchalo.',
    emoji: '🐆',
    xpReward: 50,
    status: 'available',
    objectives: [
      { id: 'meet-kimi',   text: 'Habla con Kimi',              completed: false },
      { id: 'learn-sierra', text: 'Conoce el mapa de la Sierra', completed: false },
    ],
  },

  // ── Misión 1: Capulalpam de Méndez (Nivel 1) ───────────────────────────
  {
    id: 'capulalpam-quest',
    title: 'El Corazón del Bosque',
    description: 'Capulalpam de Méndez protege su territorio con turismo comunal. Aprende su historia.',
    emoji: '🏔️',
    xpReward: 150,
    status: 'locked',
    prerequisite: 'intro-kimi',
    objectives: [
      { id: 'visit-cap',  text: 'Llega a Capulalpam de Méndez', completed: false },
      { id: 'quiz-cap',   text: 'Completa el reto de la comunidad', completed: false },
      { id: 'score-cap',  text: 'Consigue al menos 200 puntos', completed: false },
    ],
  },

  // ── Misión 2: Chicomezuchil (Nivel 2) ──────────────────────────────────
  {
    id: 'chicomezuchil-quest',
    title: 'La Lengua que Vive',
    description: 'En Chicomezuchil el Zapoteco es la lengua principal. Descubre su lucha contra la migración.',
    emoji: '🌿',
    xpReward: 150,
    status: 'locked',
    prerequisite: 'capulalpam-quest',
    objectives: [
      { id: 'visit-chi',  text: 'Llega a Chicomezuchil',          completed: false },
      { id: 'quiz-chi',   text: 'Completa el reto de la comunidad', completed: false },
      { id: 'score-chi',  text: 'Consigue al menos 200 puntos',    completed: false },
    ],
  },

  // ── Misión 3: El Huamuchil (Nivel 3) ───────────────────────────────────
  {
    id: 'huamuchil-quest',
    title: 'Raíces Mixtecas',
    description: 'El Huamuchil guarda tradiciones Mixtecas. La migración hacia California es su mayor reto.',
    emoji: '🌽',
    xpReward: 150,
    status: 'locked',
    prerequisite: 'chicomezuchil-quest',
    objectives: [
      { id: 'visit-hua',  text: 'Llega a El Huamuchil',            completed: false },
      { id: 'quiz-hua',   text: 'Completa el reto de la comunidad', completed: false },
      { id: 'score-hua',  text: 'Consigue al menos 200 puntos',    completed: false },
    ],
  },

  // ── Misión 4: Guelatao de Juárez (Nivel 4) ─────────────────────────────
  {
    id: 'guelatao-quest',
    title: 'La Tierra de Benito Juárez',
    description: 'Guelatao es cuna del Benemérito. Su lago encantado y sus bosques guardan secretos.',
    emoji: '⭐',
    xpReward: 150,
    status: 'locked',
    prerequisite: 'huamuchil-quest',
    objectives: [
      { id: 'visit-gue',  text: 'Llega a Guelatao de Juárez',      completed: false },
      { id: 'quiz-gue',   text: 'Completa el reto de la comunidad', completed: false },
      { id: 'score-gue',  text: 'Consigue al menos 200 puntos',    completed: false },
    ],
  },

  // ── Misión 5: San Cristóbal Lachirioag (Nivel 5) ───────────────────────
  {
    id: 'lachirioag-quest',
    title: 'El Xhon que Resuena',
    description: 'Lachirioag habla 100% en Xhon Zapoteco. Sus 3 microclimas y el cerro Yiawiz te esperan.',
    emoji: '🎶',
    xpReward: 200,
    status: 'locked',
    prerequisite: 'guelatao-quest',
    objectives: [
      { id: 'visit-lac',  text: 'Llega a San Cristóbal Lachirioag', completed: false },
      { id: 'quiz-lac',   text: 'Completa el reto de la comunidad', completed: false },
      { id: 'score-lac',  text: 'Consigue la puntuación máxima',   completed: false },
    ],
  },
];

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS_DATA.find((m) => m.id === id);
}

// Inicializa misiones sincronizando con el nivel del jugador
export function initMissionsForPlayer(nivelActual: number): Mission[] {
  return MISSIONS_DATA.map((m, i) => {
    if (m.id === 'intro-kimi') return { ...m, status: nivelActual >= 1 ? 'completed' : 'available' };
    const missionNivel = i; // misión i corresponde al nivel i (1-5)
    if (nivelActual > missionNivel)  return { ...m, status: 'completed' };
    if (nivelActual === missionNivel) return { ...m, status: 'available' };
    return { ...m, status: 'locked' };
  });
}
