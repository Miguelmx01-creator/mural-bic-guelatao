'use client';

import { useEffect, useState } from 'react';
import { type PreguntaImpostor } from '@/lib/preguntas';

const TIEMPO_TOTAL = 12;

interface Props {
  pregunta:   PreguntaImpostor;
  onTerminar: (puntos: number) => void;
}

export default function ElImpostor({ pregunta, onTerminar }: Props) {
  const [timeLeft, setTimeLeft]   = useState(TIEMPO_TOTAL);
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [revelado, setRevelado]   = useState(false);

  useEffect(() => {
    if (revelado) return;
    if (timeLeft <= 0) { resolver(-1); return; } // -1 = tiempo agotado (ninguno seleccionado)
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, revelado]); // eslint-disable-line

  function resolver(idx: number) {
    if (revelado) return;
    setSeleccion(idx);
    setRevelado(true);
    const correcto = idx >= 0 && pregunta.items[idx].esImpostor;
    setTimeout(() => onTerminar(correcto ? 150 : 0), 2200);
  }

  const impostorIdx = pregunta.items.findIndex(i => i.esImpostor);
  const pct         = (timeLeft / TIEMPO_TOTAL) * 100;
  const rojo        = timeLeft <= 4;

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6 gap-4">
      {/* Timer */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-white/40 text-[10px] uppercase tracking-widest">Tiempo</span>
          <span className="font-game text-lg leading-none" style={{ color: rojo ? '#E5532E' : '#F2C14E' }}>
            {timeLeft}s
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: rojo ? '#E5532E' : '#F2C14E',
            transition: 'width 1s linear, background 0.4s',
            borderRadius: 'inherit',
          }} />
        </div>
      </div>

      <div className="text-center">
        <p className="font-game text-[#E5532E] text-base tracking-wide">🕵️ EL IMPOSTOR</p>
        <p className="text-white/50 text-xs mt-1">
          3 datos son de <span className="text-white/80">{pregunta.comunidadBase}</span>.
          {' '}Encuentra el que NO pertenece.
        </p>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-3 flex-1">
        {pregunta.items.map((item, i) => {
          const esSeleccionado = seleccion === i;
          const esImpostor     = item.esImpostor;

          let bg     = 'rgba(255,255,255,0.04)';
          let border = 'rgba(255,255,255,0.1)';
          let labelColor = 'rgba(255,255,255,0.35)';
          let textColor  = 'rgba(255,255,255,0.85)';
          let cls        = '';

          if (revelado) {
            if (esImpostor) {
              bg         = 'rgba(229,83,46,0.12)';
              border     = '#E5532E';
              labelColor = '#E5532E';
              textColor  = 'white';
              cls        = esSeleccionado ? 'game-correct' : '';
            } else if (esSeleccionado) {
              bg        = 'rgba(229,83,46,0.08)';
              border    = 'rgba(229,83,46,0.4)';
              textColor = 'rgba(255,255,255,0.4)';
              cls       = 'game-shake';
            } else {
              bg        = 'rgba(47,184,154,0.06)';
              border    = 'rgba(47,184,154,0.3)';
              textColor = 'rgba(255,255,255,0.5)';
            }
          }

          return (
            <button
              key={i}
              onClick={() => resolver(i)}
              disabled={revelado}
              className={`rounded-xl px-4 py-3 text-left transition-all active:scale-[0.98] ${cls}`}
              style={{ background: bg, border: `1px solid ${border}` }}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider block mb-1" style={{ color: labelColor }}>
                {item.label}
              </span>
              <span className="text-sm leading-snug" style={{ color: textColor }}>
                {item.valor}
              </span>
              {revelado && esImpostor && item.comunidadImpostor && (
                <span className="block text-[10px] mt-1.5" style={{ color: '#E5532E' }}>
                  ← Esto es de {item.comunidadImpostor}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {revelado && (
        <div className="text-center">
          {seleccion !== null && seleccion >= 0 && pregunta.items[seleccion].esImpostor ? (
            <p className="font-game text-[#2FB89A] text-xl">✅ ¡IMPOSTOR ENCONTRADO!</p>
          ) : (
            <p className="font-game text-[#E5532E] text-xl">
              ❌ {seleccion === -1 ? 'TIEMPO AGOTADO' : 'EQUIVOCADO'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
