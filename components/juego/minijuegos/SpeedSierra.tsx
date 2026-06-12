'use client';

import { useEffect, useRef, useState } from 'react';
import { type PreguntaSpeed } from '@/lib/preguntas';

const TIEMPO_TOTAL = 30;

interface Props {
  pregunta:   PreguntaSpeed;
  onTerminar: (puntos: number) => void;
}

type EstadoRespuesta = 'pendiente' | 'correcta' | 'incorrecta';

export default function SpeedSierra({ pregunta, onTerminar }: Props) {
  const [timeLeft, setTimeLeft]     = useState(TIEMPO_TOTAL);
  const [currentQ, setCurrentQ]     = useState(0);
  const [estados, setEstados]       = useState<EstadoRespuesta[]>(
    () => pregunta.preguntas.map(() => 'pendiente')
  );
  const [seleccion, setSeleccion]   = useState<boolean | null>(null);
  const [terminado, setTerminado]   = useState(false);
  const terminadoRef                = useRef(false);

  useEffect(() => {
    if (terminadoRef.current) return;
    if (timeLeft <= 0) {
      finalizar();
      return;
    }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft]); // eslint-disable-line

  function finalizar() {
    if (terminadoRef.current) return;
    terminadoRef.current = true;
    setTerminado(true);
  }

  useEffect(() => {
    if (!terminado) return;
    const pts = estados.filter(e => e === 'correcta').length * 30;
    const id  = setTimeout(() => onTerminar(pts), 1500);
    return () => clearTimeout(id);
  }, [terminado]); // eslint-disable-line

  function responder(resp: boolean) {
    if (terminado || seleccion !== null) return;
    const correcta = resp === pregunta.preguntas[currentQ].respuesta;
    setSeleccion(resp);
    setEstados(prev => {
      const n = [...prev];
      n[currentQ] = correcta ? 'correcta' : 'incorrecta';
      return n;
    });

    setTimeout(() => {
      setSeleccion(null);
      if (currentQ + 1 >= pregunta.preguntas.length) {
        finalizar();
      } else {
        setCurrentQ(q => q + 1);
      }
    }, 500);
  }

  const q       = pregunta.preguntas[currentQ];
  const urgente = timeLeft <= 8;
  const critico = timeLeft <= 4;
  const pts     = estados.filter(e => e === 'correcta').length * 30;

  return (
    <div className="flex flex-col h-full px-4 pt-4 pb-6 gap-4">
      {/* Countdown + progreso */}
      <div className="flex items-center justify-between">
        {/* Timer bomba */}
        <div className="text-center">
          <p className="text-white/30 text-[9px] uppercase tracking-widest">⏱️ tiempo</p>
          <p
            className="font-game leading-none text-5xl"
            style={{
              color:      critico ? '#E5532E' : urgente ? '#F2C14E' : '#2FB89A',
              textShadow: critico ? '0 0 20px rgba(229,83,46,0.7)' : urgente ? '0 0 16px rgba(242,193,78,0.5)' : 'none',
              transition: 'color 0.5s, text-shadow 0.5s',
            }}
          >
            {timeLeft}
          </p>
        </div>

        {/* Puntos en curso */}
        <div className="text-center">
          <p className="text-white/30 text-[9px] uppercase tracking-widest">Puntos</p>
          <p className="font-game text-[#F2C14E] text-3xl leading-none">{pts}</p>
        </div>

        {/* Indicador de pregunta */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-white/30 text-[9px] uppercase tracking-widest">
            {currentQ + 1}/{pregunta.preguntas.length}
          </p>
          <div className="flex gap-1">
            {pregunta.preguntas.map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all"
                style={{
                  background:
                    estados[i] === 'correcta'   ? '#2FB89A' :
                    estados[i] === 'incorrecta' ? '#E5532E' :
                    i === currentQ              ? '#F2C14E' :
                    'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pregunta */}
      {!terminado && q && (
        <>
          <div
            className="rounded-2xl px-5 py-4 flex-1 flex flex-col justify-center"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">
              ¿Es correcto sobre <span className="text-white/60">{pregunta.comunidad}</span>?
            </p>
            <p className="text-[#F2C14E]/70 text-[10px] font-bold uppercase tracking-wider mt-3 mb-1.5">
              {q.label}:
            </p>
            <p className="text-white text-sm leading-relaxed">{q.valor}</p>
          </div>

          {/* Botones SÍ / NO */}
          <div className="grid grid-cols-2 gap-3">
            {([true, false] as const).map(resp => {
              const label    = resp ? 'SÍ' : 'NO';
              const activo   = seleccion === resp;
              const correcto = seleccion !== null && resp === q.respuesta;
              const incorrecto = seleccion !== null && activo && resp !== q.respuesta;

              return (
                <button
                  key={String(resp)}
                  onClick={() => responder(resp)}
                  disabled={seleccion !== null}
                  className={`font-game text-2xl py-5 rounded-2xl transition-all active:scale-95 ${
                    incorrecto ? 'game-shake' : ''
                  }`}
                  style={{
                    background:
                      correcto   ? 'rgba(47,184,154,0.2)'   :
                      incorrecto ? 'rgba(229,83,46,0.2)'    :
                      resp       ? 'rgba(47,184,154,0.1)'   :
                                   'rgba(229,83,46,0.1)',
                    border:
                      correcto   ? '2px solid #2FB89A' :
                      incorrecto ? '2px solid #E5532E' :
                      resp       ? '2px solid rgba(47,184,154,0.4)'  :
                                   '2px solid rgba(229,83,46,0.4)',
                    color:
                      correcto   ? '#2FB89A' :
                      incorrecto ? '#E5532E' :
                      resp       ? 'rgba(47,184,154,0.9)' :
                                   'rgba(229,83,46,0.9)',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Resultado final */}
      {terminado && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="font-game text-[#F2C14E] text-4xl" style={{ textShadow: '0 0 20px rgba(242,193,78,0.5)' }}>
              {pts} pts
            </p>
            <p className="text-white/40 text-sm mt-2">
              {estados.filter(e => e === 'correcta').length}/{pregunta.preguntas.length} correctas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
