'use client';

// Sistema de diálogos 2D superpuesto al Canvas 3D.
// Incluye efecto typewriter, soporte para elecciones y retrato del hablante.

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../engine/GameContext';
import type { DialogNode } from '@/lib/game-state';

const SPEAKER_EMOJI: Record<string, string> = {
  jaguar:   '🐆',
  narrator: '📖',
  npc:      '🧑',
};

const SPEAKER_COLOR: Record<string, string> = {
  jaguar:   '#F2C14E',
  narrator: '#9BB8D4',
  npc:      '#2FB89A',
};

const TYPEWRITER_SPEED = 28; // ms por carácter

export default function DialogSystem() {
  const { state, advanceDialog, dispatch } = useGame();
  const { isDialogOpen, activeDialog, activeNodeId } = state;

  const [displayText, setDisplayText]   = useState('');
  const [isTyping, setIsTyping]         = useState(false);
  const [showChoices, setShowChoices]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentNode: DialogNode | null = activeDialog && activeNodeId
    ? activeDialog.nodes.find((n) => n.id === activeNodeId) ?? null
    : null;

  // Typewriter effect al cambiar de nodo
  useEffect(() => {
    if (!currentNode) return;

    setDisplayText('');
    setShowChoices(false);
    setIsTyping(true);

    let i = 0;
    const text = currentNode.text;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(intervalRef.current!);
        setIsTyping(false);
        if (currentNode.choices?.length) {
          setTimeout(() => setShowChoices(true), 200);
        }
      }
    }, TYPEWRITER_SPEED);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentNode?.id]); // eslint-disable-line

  // Al terminar misión del nodo
  const handleNodeComplete = useCallback((nextId: string | null) => {
    if (currentNode?.onComplete) {
      dispatch({ type: 'ACTIVATE_MISSION', missionId: currentNode.onComplete });
      dispatch({
        type: 'COMPLETE_OBJECTIVE',
        missionId: 'intro-kimi',
        objectiveId: 'meet-kimi',
      });
    }
    advanceDialog(nextId);
  }, [currentNode, advanceDialog, dispatch]);

  // Click en el globo: avanza el texto o el diálogo
  function handleBubbleClick() {
    if (isTyping) {
      // Skip typewriter — mostrar todo el texto de golpe
      if (intervalRef.current) clearInterval(intervalRef.current);
      setDisplayText(currentNode?.text ?? '');
      setIsTyping(false);
      if (currentNode?.choices?.length) setShowChoices(true);
      return;
    }
    if (currentNode?.choices?.length) return; // esperar que elija
    handleNodeComplete(currentNode?.nextId ?? null);
  }

  if (!isDialogOpen || !currentNode) return null;

  const emoji = SPEAKER_EMOJI[currentNode.speaker] ?? '💬';
  const color = SPEAKER_COLOR[currentNode.speaker] ?? '#F2C14E';
  const speakerLabel = currentNode.speakerName ?? currentNode.speaker;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-end pb-6 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNode.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="pointer-events-auto"
        >
          <div
            className="rounded-2xl p-4 max-w-lg mx-auto cursor-pointer select-none"
            style={{
              background: 'rgba(10, 8, 20, 0.92)',
              border: `1px solid ${color}40`,
              boxShadow: `0 4px 32px rgba(0,0,0,0.5), 0 0 20px ${color}15`,
            }}
            onClick={handleBubbleClick}
          >
            {/* Cabecera: nombre del hablante */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{emoji}</span>
              <span
                className="font-game text-sm tracking-wider uppercase"
                style={{ color }}
              >
                {speakerLabel}
              </span>
              {isTyping && (
                <span className="ml-auto flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{
                        background: color,
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '0.6s',
                      }}
                    />
                  ))}
                </span>
              )}
            </div>

            {/* Texto con typewriter */}
            <p className="text-white/90 text-sm leading-relaxed min-h-[3rem]">
              {displayText}
              {isTyping && (
                <span
                  className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
                  style={{ background: color }}
                />
              )}
            </p>

            {/* Elecciones */}
            <AnimatePresence>
              {showChoices && currentNode.choices && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex flex-col gap-2"
                >
                  {currentNode.choices.map((choice) => (
                    <button
                      key={choice.nextId}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNodeComplete(choice.nextId);
                        setShowChoices(false);
                      }}
                      className="text-left rounded-xl px-3 py-2 text-sm transition-all active:scale-[0.98]"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}35`,
                        color: 'rgba(255,255,255,0.85)',
                      }}
                    >
                      <span style={{ color }}>▶ </span>
                      {choice.text}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicador "toca para continuar" */}
            {!isTyping && !showChoices && currentNode.nextId !== undefined && (
              <p
                className="text-right text-[10px] mt-2 animate-pulse"
                style={{ color: `${color}60` }}
              >
                Toca para continuar ▶
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
