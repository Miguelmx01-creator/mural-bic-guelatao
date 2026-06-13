'use client';

// Overlay de minijuego: monta NivelJuego sobre el Canvas 3D dimido.
// Fase 4: otorga ítem cultural + verifica logros al completar.

import { motion } from 'framer-motion';
import { useGame } from '../engine/GameContext';
import NivelJuego from '@/components/juego/NivelJuego';
import { actualizarProgreso } from '@/lib/jugadores';
import { checkNewAchievements } from '@/lib/achievements';
import { COMMUNITY_ITEMS } from '@/lib/inventory';

export default function MinigameOverlay() {
  const { state, dispatch } = useGame();
  const jugador = state.jugador;
  const nivel   = state.activeCommunityLevel;

  if (!jugador || nivel == null) return null;

  // ── Al completar el quiz ──────────────────────────────────────────────────
  async function handleCompletado(puntosGanados: number) {
    if (!jugador || nivel == null) return;

    const esFirstTime   = jugador.nivelActual === nivel;
    const esUltimoNivel = nivel === 5;

    // Calcular nuevo estado para verificar logros
    const newNivelActual   = Math.min(Math.max(jugador.nivelActual, nivel + 1), 6);
    const newTotalPuntaje  = jugador.puntaje + puntosGanados;

    // Otorgar ítem cultural de la comunidad
    const itemTemplate = COMMUNITY_ITEMS[nivel];
    if (itemTemplate) {
      dispatch({ type: 'COLLECT_ITEM', item: { ...itemTemplate, quantity: 1 } });
    }

    // Calcular nuevo conteo de inventario para verificar logros de colección
    const alreadyOwned     = state.inventory.some((i) => i.id === itemTemplate?.id);
    const newInventoryCount = alreadyOwned ? state.inventory.length : state.inventory.length + 1;

    // Verificar y desbloquear logros nuevos
    const newAchievementIds = checkNewAchievements({
      newNivelActual,
      puntosNivel:       puntosGanados,
      newTotalPuntaje,
      newInventoryCount,
      existing:          state.achievements,
    });
    // Despachamos uno por uno: el último se mostrará como toast
    for (const id of newAchievementIds) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENT', id });
    }

    // Actualización optimista de jugador en GameContext
    dispatch({
      type: 'UPDATE_JUGADOR',
      partial: { puntaje: newTotalPuntaje, nivelActual: newNivelActual },
    });

    // Navegar a la siguiente escena
    dispatch({ type: 'SET_COMMUNITY', nivel: null });
    if (esFirstTime && esUltimoNivel) {
      dispatch({ type: 'SET_SCENE', scene: 'ranking' });
    } else {
      dispatch({ type: 'SET_SCENE', scene: 'world-map' });
    }

    // Sincronizar con Firestore en segundo plano
    try {
      const updated = await actualizarProgreso(jugador.id, nivel, puntosGanados);
      dispatch({
        type: 'UPDATE_JUGADOR',
        partial: { puntaje: updated.puntaje, nivelActual: updated.nivelActual },
      });
    } catch (e) {
      console.error('Error al sincronizar progreso:', e);
    }
  }

  // ── "← Mapa" durante el quiz → volver al mapa 3D ────────────────────────
  function handleSalir() {
    dispatch({ type: 'SET_COMMUNITY', nivel: null });
    dispatch({ type: 'SET_SCENE', scene: 'world-map' });
  }

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-hidden"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 34 }}
    >
      <NivelJuego
        jugador={jugador}
        nivel={nivel}
        onCompletado={handleCompletado}
        onSalir={handleSalir}
      />
    </motion.div>
  );
}
