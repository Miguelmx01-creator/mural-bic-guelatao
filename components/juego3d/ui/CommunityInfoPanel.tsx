'use client';

// Panel 2D que aparece al tocar un nodo de comunidad en el mapa.
// Slide-up desde abajo con Framer Motion.
// Permite iniciar el juego 2D (redirige a /juego con nivel preseleccionado)
// o cerrar el panel sin navegar.

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../engine/GameContext';
import { COMUNIDADES } from '@/lib/preguntas';

// ─── Etiqueta + valor ─────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm leading-snug">
      <span style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.9)' }}>{value}</span>
    </div>
  );
}

// ─── Insignia de estado ───────────────────────────────────────────────────────
function StatusBadge({ nivelActual, nivel }: { nivelActual: number; nivel: number }) {
  if (nivel < nivelActual) {
    return (
      <span
        className="text-xs px-2 py-0.5 rounded-full font-body"
        style={{ background: 'rgba(242,193,78,0.15)', color: '#F2C14E', border: '1px solid rgba(242,193,78,0.3)' }}
      >
        ✓ Completado
      </span>
    );
  }
  if (nivel === nivelActual && nivelActual <= 5) {
    return (
      <span
        className="text-xs px-2 py-0.5 rounded-full font-body animate-pulse"
        style={{ background: 'rgba(47,184,154,0.2)', color: '#2FB89A', border: '1px solid rgba(47,184,154,0.4)' }}
      >
        ► Disponible
      </span>
    );
  }
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-body"
      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      🔒 Bloqueado
    </span>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────
export default function CommunityInfoPanel() {
  const { state, dispatch } = useGame();
  const nivel = state.activeCommunityLevel;
  const nivelActual = state.jugador?.nivelActual ?? 1;

  // Datos de la comunidad seleccionada
  const com = nivel != null ? COMUNIDADES.find((c) => c.nivel === nivel) : null;

  // Cierra con Escape en escritorio
  useEffect(() => {
    if (!com) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch({ type: 'SET_COMMUNITY', nivel: null });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [com, dispatch]);

  const canPlay = com != null && com.nivel <= nivelActual;
  const isReplay = com != null && com.nivel < nivelActual;

  function handleJugar() {
    if (!com) return;
    // activeCommunityLevel ya está fijado en com.nivel; solo cambiamos la escena
    dispatch({ type: 'SET_SCENE', scene: 'community' });
  }

  return (
    <AnimatePresence>
      {com != null && (
        <>
          {/* ── Backdrop táctil ──────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'transparent' }}
            onClick={() => dispatch({ type: 'SET_COMMUNITY', nivel: null })}
          />

          {/* ── Panel ────────────────────────────────────────────────────── */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-40 rounded-t-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(to top, #0A0F0A 0%, #111A12 100%)',
              borderTop: `2px solid ${com.color}40`,
              boxShadow: `0 -8px 32px ${com.color}25`,
              maxHeight: '75dvh',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Asa de arrastre ──────────────────────────────────────── */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: `${com.color}40` }}
              />
            </div>

            {/* ── Contenido con scroll ─────────────────────────────────── */}
            <div className="overflow-y-auto px-5 pb-6" style={{ maxHeight: '60dvh' }}>

              {/* Encabezado */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-3xl flex-shrink-0">{com.emoji}</span>
                  <div className="min-w-0">
                    <h2
                      className="font-display font-bold text-base leading-tight truncate"
                      style={{ color: com.color }}
                    >
                      Nivel {com.nivel}: {com.nombre}
                    </h2>
                    <div className="mt-1">
                      <StatusBadge nivelActual={nivelActual} nivel={com.nivel} />
                    </div>
                  </div>
                </div>
                {/* Cerrar */}
                <button
                  onClick={() => dispatch({ type: 'SET_COMMUNITY', nivel: null })}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center active:opacity-60 transition-opacity"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  aria-label="Cerrar panel"
                >
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>✕</span>
                </button>
              </div>

              {/* Datos de la comunidad */}
              <div
                className="rounded-xl p-3.5 mb-4 flex flex-col gap-2"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <InfoRow label="Lengua:" value={com.datos.lengua} />
                <InfoRow label="Ubicación:" value={com.datos.ubicacion} />
                <InfoRow label="Ambiente:" value={com.datos.ambiente} />
                <InfoRow label="Problema:" value={com.datos.problema} />
              </div>

              {/* Botón de acción */}
              <button
                onClick={handleJugar}
                disabled={!canPlay}
                className="w-full py-3.5 rounded-xl font-game text-sm tracking-widest transition-all active:scale-95 disabled:cursor-not-allowed"
                style={
                  canPlay
                    ? {
                        background: `linear-gradient(135deg, ${com.color} 0%, ${com.color}CC 100%)`,
                        color: '#0A0F0A',
                        boxShadow: `0 4px 18px ${com.color}55`,
                      }
                    : {
                        background: 'rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.25)',
                        border: '1px solid rgba(255,255,255,0.1)',
                      }
                }
              >
                {!canPlay
                  ? '🔒 NIVEL BLOQUEADO'
                  : isReplay
                    ? `↩ REJUGAR NIVEL ${com.nivel}`
                    : `▶ JUGAR NIVEL ${com.nivel}`}
              </button>

              {/* Texto de ayuda debajo del botón */}
              {!canPlay && (
                <p
                  className="text-center text-xs mt-2 font-body"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  Completa los niveles anteriores para desbloquear esta comunidad.
                </p>
              )}
              {isReplay && canPlay && (
                <p
                  className="text-center text-xs mt-2 font-body"
                  style={{ color: `${com.color}80` }}
                >
                  Ya completaste este nivel. ¡Puedes volver a jugarlo!
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
