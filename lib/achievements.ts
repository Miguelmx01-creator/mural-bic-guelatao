// Definición de logros del videojuego educativo.
// Se evalúan al final de cada nivel y al iniciar sesión (para jugadores con progreso previo).

import type { Achievement } from './game-state';
import type { Jugador } from './jugadores';

// ─── Catálogo completo ────────────────────────────────────────────────────────

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'semilla',
    title: 'Semilla',
    description: 'Completaste tu primer nivel en la Sierra Norte.',
    emoji: '🌱',
    unlockedAt: null,
  },
  {
    id: 'en-camino',
    title: 'En el Camino',
    description: 'Completaste 3 comunidades. La Sierra te conoce.',
    emoji: '🌿',
    unlockedAt: null,
  },
  {
    id: 'sierra-completa',
    title: 'Sierra Completa',
    description: '¡Conociste las 5 comunidades de la Sierra Norte!',
    emoji: '🌳',
    unlockedAt: null,
  },
  {
    id: 'buena-cosecha',
    title: 'Buena Cosecha',
    description: 'Obtuviste más de 100 puntos en un solo nivel.',
    emoji: '⭐',
    unlockedAt: null,
  },
  {
    id: 'experto',
    title: 'Experto Cultural',
    description: 'Obtuviste más de 200 puntos en un solo nivel.',
    emoji: '🎯',
    unlockedAt: null,
  },
  {
    id: 'tesoro',
    title: 'Tesoro de la Sierra',
    description: 'Acumulaste más de 500 puntos en total.',
    emoji: '💰',
    unlockedAt: null,
  },
  {
    id: 'maestro',
    title: 'Maestro',
    description: 'Acumulaste más de 800 puntos en total.',
    emoji: '🔥',
    unlockedAt: null,
  },
  {
    id: 'coleccionista',
    title: 'Coleccionista',
    description: 'Recolectaste 3 objetos culturales de la Sierra.',
    emoji: '🏺',
    unlockedAt: null,
  },
  {
    id: 'guardian',
    title: 'Guardián de Culturas',
    description: 'Recolectaste todos los objetos culturales de las comunidades.',
    emoji: '🛡️',
    unlockedAt: null,
  },
];

// ─── Estado inicial basado en el progreso existente ──────────────────────────
// Se llama en el action LOGIN para no perder logros de sesiones anteriores.

export function initAchievementsForPlayer(jugador: Jugador): Achievement[] {
  const placeholder = new Date(0); // fecha usada para logros pre-existentes sin timestamp real
  return ALL_ACHIEVEMENTS.map((a): Achievement => {
    let unlocked = false;
    switch (a.id) {
      case 'semilla':          unlocked = jugador.nivelActual >= 2;    break;
      case 'en-camino':        unlocked = jugador.nivelActual >= 4;    break;
      case 'sierra-completa':  unlocked = jugador.nivelActual >= 6;    break;
      case 'tesoro':           unlocked = jugador.puntaje >= 500;      break;
      case 'maestro':          unlocked = jugador.puntaje >= 800;      break;
      // Los demás dependen de información por-nivel que no se puede inferir del estado actual
    }
    return { ...a, unlockedAt: unlocked ? placeholder : null };
  });
}

// ─── Evaluación al completar un nivel ────────────────────────────────────────
// Retorna los IDs de logros que se deben desbloquear ahora.

export function checkNewAchievements({
  newNivelActual,
  puntosNivel,
  newTotalPuntaje,
  newInventoryCount,
  existing,
}: {
  newNivelActual:    number;
  puntosNivel:       number;
  newTotalPuntaje:   number;
  newInventoryCount: number;
  existing:          Achievement[];
}): string[] {
  const unlocked = new Set(existing.filter((a) => a.unlockedAt !== null).map((a) => a.id));
  const toUnlock: string[] = [];

  function maybe(id: string, condition: boolean) {
    if (condition && !unlocked.has(id)) toUnlock.push(id);
  }

  maybe('semilla',         newNivelActual >= 2);
  maybe('en-camino',       newNivelActual >= 4);
  maybe('sierra-completa', newNivelActual >= 6);
  maybe('buena-cosecha',   puntosNivel > 100);
  maybe('experto',         puntosNivel > 200);
  maybe('tesoro',          newTotalPuntaje >= 500);
  maybe('maestro',         newTotalPuntaje >= 800);
  maybe('coleccionista',   newInventoryCount >= 3);
  maybe('guardian',        newInventoryCount >= 5);

  return toUnlock;
}
