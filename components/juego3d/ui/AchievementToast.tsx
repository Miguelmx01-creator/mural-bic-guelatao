'use client';

// Notificación de logro desbloqueado.
// Auto-desaparece a los 3.5s. Se posiciona bajo el HUD superior.

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../engine/GameContext';

export default function AchievementToast() {
  const { state, dispatch } = useGame();
  const toast = state.toastAchievement;

  // Auto-cerrar
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3600);
    return () => clearTimeout(t);
  }, [toast, dispatch]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          className="absolute top-20 left-1/2 z-50 pointer-events-none"
          style={{ x: '-50%' }}
          initial={{ y: -56, opacity: 0, scale: 0.85 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -40, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        >
          <div
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #141E0F 0%, #0D1A0D 100%)',
              border: '1px solid rgba(242,193,78,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 24px rgba(242,193,78,0.12)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Ícono animado */}
            <motion.span
              className="text-2xl flex-shrink-0"
              initial={{ rotate: -15, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.08 }}
            >
              {toast.emoji}
            </motion.span>

            {/* Texto */}
            <div className="min-w-0">
              <p
                className="text-[9px] tracking-[0.18em] uppercase mb-0.5"
                style={{ color: 'rgba(242,193,78,0.55)' }}
              >
                LOGRO DESBLOQUEADO
              </p>
              <p className="font-game text-sm text-white leading-tight">{toast.title}</p>
              <p
                className="text-[10px] mt-0.5 leading-snug max-w-[220px]"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {toast.description}
              </p>
            </div>
          </div>

          {/* Barra de progreso de auto-cierre */}
          <motion.div
            className="h-0.5 rounded-full mt-1 mx-1"
            style={{ background: 'rgba(242,193,78,0.35)', originX: 0 }}
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 3.4, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
