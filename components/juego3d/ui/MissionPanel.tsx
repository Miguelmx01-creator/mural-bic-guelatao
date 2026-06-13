'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../engine/GameContext';
import type { Mission } from '@/lib/game-state';

const STATUS_COLOR = {
  locked:    'rgba(255,255,255,0.15)',
  available: '#F2C14E',
  active:    '#2FB89A',
  completed: '#4CAF50',
} as const;

const STATUS_LABEL = {
  locked:    '🔒 Bloqueada',
  available: '✨ Disponible',
  active:    '⚡ Activa',
  completed: '✅ Completada',
} as const;

function MissionCard({ mission }: { mission: Mission }) {
  const color = STATUS_COLOR[mission.status];
  const completedCount = mission.objectives.filter((o) => o.completed).length;
  const progress = mission.objectives.length > 0
    ? completedCount / mission.objectives.length
    : 0;

  return (
    <div
      className="rounded-xl p-3 mb-2"
      style={{
        background: mission.status === 'active'
          ? 'rgba(47,184,154,0.07)'
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${color}30`,
        opacity: mission.status === 'locked' ? 0.45 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-1.5">
        <span className="text-xl flex-shrink-0">{mission.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="text-white/90 text-sm font-semibold leading-tight truncate">
            {mission.title}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color }}>
            {STATUS_LABEL[mission.status]}
          </p>
        </div>
        <span className="font-game text-xs flex-shrink-0" style={{ color: '#F2C14E' }}>
          +{mission.xpReward}xp
        </span>
      </div>

      {/* Descripción */}
      {mission.status !== 'locked' && (
        <p className="text-white/50 text-xs leading-snug mb-2">
          {mission.description}
        </p>
      )}

      {/* Objetivos */}
      {mission.status !== 'locked' && (
        <div className="space-y-1">
          {mission.objectives.map((obj) => (
            <div key={obj.id} className="flex items-center gap-2">
              <span className="text-xs flex-shrink-0">
                {obj.completed ? '✅' : '○'}
              </span>
              <p
                className="text-xs leading-tight"
                style={{
                  color: obj.completed ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.7)',
                  textDecoration: obj.completed ? 'line-through' : 'none',
                }}
              >
                {obj.text}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Barra de progreso (solo misiones activas/completadas) */}
      {(mission.status === 'active' || mission.status === 'completed') && mission.objectives.length > 0 && (
        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress * 100}%`,
              background: mission.status === 'completed' ? '#4CAF50' : '#2FB89A',
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function MissionPanel() {
  const { state, dispatch } = useGame();
  const { isMissionPanelOpen, missions } = state;

  const activeMissions    = missions.filter((m) => m.status === 'active' || m.status === 'available');
  const completedMissions = missions.filter((m) => m.status === 'completed');
  const lockedMissions    = missions.filter((m) => m.status === 'locked');

  return (
    <AnimatePresence>
      {isMissionPanelOpen && (
        <>
          {/* Overlay oscuro */}
          <motion.div
            className="absolute inset-0 z-40 bg-black/40 pointer-events-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'TOGGLE_MISSIONS' })}
          />

          {/* Panel lateral */}
          <motion.div
            className="absolute top-0 right-0 bottom-0 z-50 pointer-events-auto w-80 max-w-[90vw] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ background: 'rgba(8, 6, 18, 0.97)' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 pt-5 pb-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(242,193,78,0.15)' }}
            >
              <h2
                className="font-game text-[#F2C14E] text-xl tracking-wider"
                style={{ textShadow: '0 0 10px rgba(242,193,78,0.4)' }}
              >
                📋 MISIONES
              </h2>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_MISSIONS' })}
                className="text-white/40 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg active:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Contenido scrollable */}
            <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">

              {/* Misiones activas */}
              {activeMissions.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-[#2FB89A] font-bold tracking-[0.18em] uppercase mb-2 px-1">
                    — EN PROGRESO —
                  </p>
                  {activeMissions.map((m) => (
                    <MissionCard key={m.id} mission={m} />
                  ))}
                </div>
              )}

              {/* Misiones completadas */}
              {completedMissions.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] text-white/30 font-bold tracking-[0.18em] uppercase mb-2 px-1">
                    — COMPLETADAS ({completedMissions.length}) —
                  </p>
                  {completedMissions.map((m) => (
                    <MissionCard key={m.id} mission={m} />
                  ))}
                </div>
              )}

              {/* Misiones bloqueadas */}
              {lockedMissions.length > 0 && (
                <div>
                  <p className="text-[10px] text-white/20 font-bold tracking-[0.18em] uppercase mb-2 px-1">
                    — PRÓXIMAMENTE —
                  </p>
                  {lockedMissions.map((m) => (
                    <MissionCard key={m.id} mission={m} />
                  ))}
                </div>
              )}

              {missions.length === 0 && (
                <p className="text-white/25 text-sm text-center mt-12">
                  Las misiones aparecerán cuando comiences el juego.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
