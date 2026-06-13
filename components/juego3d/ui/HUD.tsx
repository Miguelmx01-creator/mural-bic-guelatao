'use client';

// HUD educativo: overlay 2D sobre el Canvas 3D.
// Muestra puntaje, nivel, jugador, y botones de misiones/ranking/salir.

import { motion } from 'framer-motion';
import { useGame } from '../engine/GameContext';

// Barra de XP visual
function XPBar({ nivelActual }: { nivelActual: number }) {
  const porcentaje = Math.min(((nivelActual - 1) / 5) * 100, 100);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-0.5">
        <span className="text-[9px] text-white/35 uppercase tracking-widest">Progreso</span>
        <span className="text-[9px] font-game" style={{ color: '#2FB89A' }}>
          {nivelActual <= 5 ? `Nivel ${nivelActual}` : '¡Sierra Conquistada!'}
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #2FB89A, #F2C14E)' }}
          initial={{ width: 0 }}
          animate={{ width: `${porcentaje}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
    </div>
  );
}

export default function HUD() {
  const { state, dispatch } = useGame();
  const { jugador, missions, scene } = state;

  // Contar misiones activas
  const activeMissionCount = missions.filter(
    (m) => m.status === 'active' || m.status === 'available'
  ).length;

  if (!jugador || scene === 'login') return null;

  return (
    <>
      {/* ── Panel superior izquierdo: jugador + puntaje ─────────────────── */}
      <motion.div
        className="absolute top-3 left-3 z-20 rounded-xl px-3 py-2 pointer-events-none"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          background: 'rgba(8, 6, 18, 0.8)',
          border: '1px solid rgba(242,193,78,0.18)',
          backdropFilter: 'blur(4px)',
          minWidth: 160,
          maxWidth: 200,
        }}
      >
        <p className="text-white/35 text-[9px] uppercase tracking-[0.18em] mb-0.5">Jugador</p>
        <p
          className="font-game text-[#F2C14E] text-base leading-tight truncate"
          style={{ textShadow: '0 0 8px rgba(242,193,78,0.4)' }}
        >
          {jugador.nombreCompleto.split(' ')[0]}
        </p>
        <p className="text-white/30 text-[10px] mb-2">{jugador.semestre} semestre</p>
        <XPBar nivelActual={jugador.nivelActual} />
      </motion.div>

      {/* ── Panel superior derecho: puntaje ─────────────────────────────── */}
      <motion.div
        className="absolute top-3 right-3 z-20 rounded-xl px-3 py-2 text-right pointer-events-none"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          background: 'rgba(8, 6, 18, 0.8)',
          border: '1px solid rgba(242,193,78,0.18)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <p className="text-white/35 text-[9px] uppercase tracking-[0.18em] mb-0.5">Puntaje</p>
        <motion.p
          className="font-game text-[#F2C14E] text-3xl leading-none"
          key={jugador.puntaje}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          style={{ textShadow: '0 0 14px rgba(242,193,78,0.5)' }}
        >
          {jugador.puntaje.toLocaleString()}
        </motion.p>
      </motion.div>

      {/* ── Barra inferior de acciones ───────────────────────────────────── */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {/* Botón Misiones */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_MISSIONS' })}
          className="relative rounded-2xl px-4 py-2.5 flex items-center gap-2 active:scale-95 transition-transform"
          style={{
            background: 'rgba(8, 6, 18, 0.88)',
            border: '1px solid rgba(47,184,154,0.35)',
          }}
        >
          <span className="text-lg">📋</span>
          <span className="font-game text-[#2FB89A] text-xs tracking-wide">MISIONES</span>
          {activeMissionCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-[#0D0D1A]"
              style={{ background: '#F2C14E' }}
            >
              {activeMissionCount}
            </span>
          )}
        </button>

        {/* Botón Ranking */}
        <button
          onClick={() => dispatch({ type: 'SET_SCENE', scene: 'ranking' })}
          className="rounded-2xl px-4 py-2.5 flex items-center gap-2 active:scale-95 transition-transform"
          style={{
            background: 'rgba(8, 6, 18, 0.88)',
            border: '1px solid rgba(242,193,78,0.25)',
          }}
        >
          <span className="text-lg">🏆</span>
          <span className="font-game text-[#F2C14E] text-xs tracking-wide">RANKING</span>
        </button>

        {/* Botón Mapa (Fase 2) */}
        <button
          onClick={() => dispatch({ type: 'SET_SCENE', scene: 'world-map' })}
          className="rounded-2xl px-4 py-2.5 flex items-center gap-2 active:scale-95 transition-transform"
          style={{
            background: 'rgba(8, 6, 18, 0.88)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <span className="text-lg">🗺️</span>
          <span className="font-game text-white/50 text-xs tracking-wide">MAPA</span>
        </button>
      </motion.div>

      {/* ── Botón Salir (esquina superior) ──────────────────────────────── */}
      <button
        onClick={() => {
          if (typeof window !== 'undefined') window.location.href = '/';
        }}
        className="absolute top-3 left-1/2 -translate-x-1/2 z-20 text-white/25 hover:text-white/60 text-xs transition-colors px-3 py-1 rounded-full"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        ← Mural
      </button>
    </>
  );
}
