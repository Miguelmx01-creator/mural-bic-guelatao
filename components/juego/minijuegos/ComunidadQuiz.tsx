'use client';

import { useEffect, useState } from 'react';
import { type PreguntaComunidadQuiz } from '@/lib/preguntas';

const TIEMPO_TOTAL = 25;

interface Props {
  pregunta:   PreguntaComunidadQuiz;
  onTerminar: (puntos: number) => void;
}

export default function ComunidadQuiz({ pregunta, onTerminar }: Props) {
  const [timeLeft, setTimeLeft]       = useState(TIEMPO_TOTAL);
  const [seleccion, setSeleccion]     = useState<string | null>(null);
  const [resultado, setResultado]     = useState<'correcto' | 'incorrecto' | null>(null);

  // Timer
  useEffect(() => {
    if (resultado !== null) return;
    if (timeLeft <= 0) { resolver(''); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, resultado]); // eslint-disable-line

  function resolver(opcion: string) {
    if (resultado !== null) return;
    const correcto = opcion === pregunta.respuestaCorrecta;
    const bonus    = correcto && timeLeft > 5 ? 50 : 0;
    setSeleccion(opcion);
    setResultado(correcto ? 'correcto' : 'incorrecto');
    setTimeout(() => onTerminar(correcto ? 100 + bonus : 0), 1800);
  }

  const pct  = (timeLeft / TIEMPO_TOTAL) * 100;
  const rojo = timeLeft <= 4;

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6 gap-5">
      {/* Timer */}
      <div>
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-white/40 text-[10px] uppercase tracking-widest">Tiempo</span>
          <span
            className="font-game text-lg leading-none"
            style={{ color: rojo ? '#E5532E' : '#F2C14E' }}
          >
            {timeLeft}s
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            style={{
              height: '100%',
              width:  `${pct}%`,
              background:  rojo ? '#E5532E' : '#F2C14E',
              transition:  'width 1s linear, background 0.4s',
              borderRadius: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Dato */}
      <div
        className="rounded-2xl px-5 py-4 flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <p className="text-[#F2C14E]/60 text-[10px] font-bold uppercase tracking-widest mb-2">
          {pregunta.labelDato}
        </p>
        <p className="text-white text-sm leading-relaxed">{pregunta.dato}</p>
      </div>

      <p className="text-center text-white/40 text-xs tracking-wide">
        ¿A qué comunidad pertenece este dato?
      </p>

      {/* Opciones */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {pregunta.opciones.map(op => {
          const esSeleccionada = seleccion === op;
          const esCorrecta     = op === pregunta.respuestaCorrecta;

          let bg     = 'rgba(255,255,255,0.05)';
          let border = 'rgba(255,255,255,0.1)';
          let color  = 'rgba(255,255,255,0.85)';
          let cls    = '';

          if (resultado !== null) {
            if (esCorrecta) {
              bg     = 'rgba(47,184,154,0.15)';
              border = '#2FB89A';
              color  = '#2FB89A';
              cls    = 'game-correct';
            } else if (esSeleccionada) {
              bg     = 'rgba(229,83,46,0.15)';
              border = '#E5532E';
              color  = '#E5532E';
              cls    = 'game-shake';
            } else {
              color = 'rgba(255,255,255,0.25)';
            }
          }

          return (
            <button
              key={op}
              onClick={() => resolver(op)}
              disabled={resultado !== null}
              className={`rounded-xl px-3 py-4 text-sm font-semibold text-center leading-tight transition-all active:scale-95 ${cls}`}
              style={{ background: bg, border: `1px solid ${border}`, color }}
            >
              {op}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {resultado !== null && (
        <div className="text-center animate-pulse">
          {resultado === 'correcto' ? (
            <p className="font-game text-[#2FB89A] text-xl">
              ✅ CORRECTO{timeLeft > 5 ? ' +50 bonus' : ''}
            </p>
          ) : (
            <p className="font-game text-[#E5532E] text-xl">❌ INCORRECTO</p>
          )}
        </div>
      )}
    </div>
  );
}
