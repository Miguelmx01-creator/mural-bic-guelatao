'use client';

// Panel de colección: objetos culturales recolectados + logros desbloqueados.
// Dos tabs: objetos culturales (5 ítems) y logros (9 achievements).
// Se abre desde el botón 🎒 del HUD.

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../engine/GameContext';
import { COMMUNITY_ITEMS } from '@/lib/inventory';

// ─── Tab: Objetos culturales ──────────────────────────────────────────────────
function ItemsTab() {
  const { state } = useGame();

  return (
    <div className="grid grid-cols-2 gap-3 pb-2">
      {Object.values(COMMUNITY_ITEMS).map((template) => {
        const owned = state.inventory.find((i) => i.id === template.id);
        return (
          <motion.div
            key={template.id}
            className="rounded-xl p-3 flex flex-col gap-1.5"
            style={{
              background: owned ? 'rgba(242,193,78,0.07)' : 'rgba(255,255,255,0.03)',
              border: owned
                ? '1px solid rgba(242,193,78,0.22)'
                : '1px solid rgba(255,255,255,0.07)',
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: owned ? 1 : 0.42, y: 0 }}
          >
            <span className="text-3xl">{owned ? template.emoji : '❓'}</span>
            <p
              className="font-game text-xs leading-tight"
              style={{ color: owned ? '#F2C14E' : 'rgba(255,255,255,0.3)' }}
            >
              {owned ? template.name : '???'}
            </p>
            {owned ? (
              <>
                <p className="text-[10px] leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {template.comunidadOrigen}
                </p>
                <p
                  className="text-[10px] leading-snug mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  {template.description}
                </p>
              </>
            ) : (
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                Completa el nivel para obtenerlo
              </p>
            )}
          </motion.div>
        );
      })}

      {/* Contador de progreso */}
      <div
        className="col-span-2 rounded-xl px-3 py-2 flex items-center justify-between"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <span className="text-xs font-body" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Objetos recolectados
        </span>
        <span className="font-game text-sm" style={{ color: '#F2C14E' }}>
          {state.inventory.length} / 5
        </span>
      </div>
    </div>
  );
}

// ─── Tab: Logros ──────────────────────────────────────────────────────────────
function LogrosTab() {
  const { state } = useGame();
  const unlocked = state.achievements.filter((a) => a.unlockedAt !== null);
  const locked   = state.achievements.filter((a) => a.unlockedAt === null);

  return (
    <div className="flex flex-col gap-2 pb-2">
      {unlocked.length > 0 && (
        <p
          className="text-[9px] tracking-[0.15em] uppercase"
          style={{ color: 'rgba(242,193,78,0.5)' }}
        >
          DESBLOQUEADOS — {unlocked.length}/{state.achievements.length}
        </p>
      )}

      {unlocked.map((a, i) => (
        <motion.div
          key={a.id}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(242,193,78,0.07)',
            border: '1px solid rgba(242,193,78,0.22)',
          }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
        >
          <span className="text-xl flex-shrink-0">{a.emoji}</span>
          <div className="min-w-0">
            <p className="font-game text-xs" style={{ color: '#F2C14E' }}>
              {a.title}
            </p>
            <p className="text-[10px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {a.description}
            </p>
          </div>
        </motion.div>
      ))}

      {locked.length > 0 && (
        <p
          className="text-[9px] tracking-[0.15em] uppercase mt-2"
          style={{ color: 'rgba(255,255,255,0.22)' }}
        >
          POR DESCUBRIR — {locked.length}
        </p>
      )}

      {locked.map((a) => (
        <div
          key={a.id}
          className="flex items-center gap-3 rounded-xl px-3 py-2"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            opacity: 0.45,
          }}
        >
          <span className="text-xl flex-shrink-0 grayscale opacity-60">{a.emoji}</span>
          <div>
            <p className="font-game text-xs text-white">???</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Sigue explorando la Sierra
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────
export default function InventoryPanel() {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState<'items' | 'logros'>('items');

  const unlockedCount = state.achievements.filter((a) => a.unlockedAt !== null).length;

  return (
    <AnimatePresence>
      {state.isInventoryOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={() => dispatch({ type: 'TOGGLE_INVENTORY' })}
          />

          {/* Panel deslizante */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-40 rounded-t-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(to top, #090E09 0%, #101810 100%)',
              borderTop: '2px solid rgba(242,193,78,0.22)',
              boxShadow: '0 -12px 48px rgba(0,0,0,0.8)',
              maxHeight: '78dvh',
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Asa */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(242,193,78,0.25)' }} />
            </div>

            {/* Header */}
            <div className="px-5 pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">🎒</span>
                  <h2
                    className="font-game text-sm tracking-widest"
                    style={{ color: '#F2C14E' }}
                  >
                    MI COLECCIÓN
                  </h2>
                </div>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_INVENTORY' })}
                  className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                  aria-label="Cerrar inventario"
                >
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>✕</span>
                </button>
              </div>

              {/* Tabs */}
              <div
                className="flex rounded-xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                {(['items', 'logros'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex-1 py-2 text-xs font-game tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    style={
                      tab === t
                        ? { background: 'rgba(242,193,78,0.15)', color: '#F2C14E' }
                        : { color: 'rgba(255,255,255,0.32)' }
                    }
                  >
                    {t === 'items' ? '🌽 OBJETOS' : `🏆 LOGROS (${unlockedCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenido scrolleable */}
            <div className="overflow-y-auto px-5" style={{ maxHeight: '56dvh' }}>
              {tab === 'items' ? <ItemsTab /> : <LogrosTab />}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
