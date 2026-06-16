'use client';

import { useState } from 'react';
import { type PreguntaComunidadQuiz } from '@/lib/preguntas';

interface Props {
  pregunta:   PreguntaComunidadQuiz;
  onTerminar: (puntos: number) => void;
}

export default function ComunidadQuiz({ pregunta, onTerminar }: Props) {
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [resultado, setResultado] = useState<'correcto' | 'incorrecto' | null>(null);

  function resolver(opcion: string) {
    if (resultado !== null) return;
    const correcto = opcion === pregunta.respuestaCorrecta;
    setSeleccion(opcion);
    setResultado(correcto ? 'correcto' : 'incorrecto');
    setTimeout(() => onTerminar(correcto ? 100 : 0), 1800);
  }

  return (
    <div className="flex flex-col h-full px-4 pt-6 pb-6 gap-5">
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
        ¿A qué estación temática pertenece este concepto?
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
              bg = 'rgba(47,184,154,0.15)'; border = '#2FB89A'; color = '#2FB89A'; cls = 'game-correct';
            } else if (esSeleccionada) {
              bg = 'rgba(229,83,46,0.15)'; border = '#E5532E'; color = '#E5532E'; cls = 'game-shake';
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
          {resultado === 'correcto'
            ? <p className="font-game text-[#2FB89A] text-xl">CORRECTO</p>
            : <p className="font-game text-[#E5532E] text-xl">INCORRECTO</p>
          }
        </div>
      )}
    </div>
  );
}
