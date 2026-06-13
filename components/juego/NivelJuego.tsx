'use client';

import { useMemo, useState } from 'react';
import { COMUNIDADES, generarComunidadQuiz, generarImpostor, generarSpeedSierra } from '@/lib/preguntas';
import { type Jugador } from '@/lib/jugadores';
import ComunidadQuiz from './minijuegos/ComunidadQuiz';
import ElImpostor    from './minijuegos/ElImpostor';
import SpeedSierra   from './minijuegos/SpeedSierra';

const RONDA_INFO = [
  { titulo: '¿De qué comunidad?', emoji: '🗺️', color: '#F2C14E' },
  { titulo: 'El Impostor',        emoji: '🕵️', color: '#E5532E' },
  { titulo: 'Speed Sierra',       emoji: '⚡', color: '#2FB89A' },
];

interface Props {
  jugador:      Jugador;
  nivel:        number;
  onCompletado: (puntosGanados: number) => void;
  onSalir:      () => void;
}

export default function NivelJuego({ jugador, nivel, onCompletado, onSalir }: Props) {
  const comunidad = COMUNIDADES[nivel - 1];

  const preguntas = useMemo(() => ({
    quiz:    generarComunidadQuiz(nivel),
    impostor: generarImpostor(nivel),
    speed:   generarSpeedSierra(nivel),
  }), [nivel]);

  const [ronda, setRonda]           = useState(0);
  const [puntosRondas, setPuntos]   = useState([0, 0, 0]);
  const [enTransicion, setTransicion] = useState(false);
  const [victoria, setVictoria]     = useState(false);

  function handleRondaTerminada(pts: number) {
    const nuevos = [...puntosRondas];
    nuevos[ronda] = pts;
    setPuntos(nuevos);

    if (ronda >= 2) {
      setVictoria(true);
      return;
    }
    setTransicion(true);
    setTimeout(() => {
      setRonda(r => r + 1);
      setTransicion(false);
    }, 2200);
  }

  const total = puntosRondas.reduce((a, b) => a + b, 0);

  // ── Pantalla de victoria ──────────────────────────────────────────────────
  if (victoria) {
    const esRepaso = jugador.nivelActual > nivel;
    const etiquetaBoton = esRepaso
      ? '↩ VOLVER AL MAPA'
      : nivel >= 5
        ? '🏆 VER RANKING'
        : 'SIGUIENTE NIVEL →';

    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center"
        style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0D0D1A 60%)' }}
      >
        <p className="text-[#2FB89A] text-xs font-bold tracking-[0.2em] uppercase mb-4">
          {esRepaso ? '¡Rejugaste el nivel!' : `¡Nivel ${nivel} completado!`}
        </p>
        <div className="text-5xl mb-3">{comunidad.emoji}</div>
        <h2 className="font-game text-white text-2xl mb-1">{comunidad.nombre}</h2>
        <p className="text-white/35 text-xs mb-8">{jugador.nombreCompleto}</p>

        {/* Desglose de puntos */}
        <div className="w-full max-w-xs space-y-2 mb-8">
          {RONDA_INFO.map((info, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-white/55 text-sm">{info.emoji} {info.titulo}</span>
              <span className="font-game text-sm" style={{ color: info.color }}>+{puntosRondas[i]}</span>
            </div>
          ))}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl"
            style={{ background: 'rgba(242,193,78,0.08)', border: '1px solid rgba(242,193,78,0.3)' }}
          >
            <span className="font-game text-[#F2C14E] text-sm tracking-wider">TOTAL</span>
            <span
              className="font-game text-[#F2C14E] text-3xl leading-none"
              style={{ textShadow: '0 0 16px rgba(242,193,78,0.5)' }}
            >
              {total}
            </span>
          </div>
        </div>

        <button
          onClick={() => onCompletado(total)}
          className="font-game text-[#0D0D1A] py-4 px-8 rounded-2xl text-lg tracking-wider active:scale-95 transition-transform"
          style={{ background: '#F2C14E', boxShadow: '0 4px 24px rgba(242,193,78,0.4)' }}
        >
          {etiquetaBoton}
        </button>
        {esRepaso && (
          <p className="text-white/35 text-xs mt-4">
            +{total} pts sumados a tu marcador ✓
          </p>
        )}
      </div>
    );
  }

  const info = RONDA_INFO[ronda];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #1a0a2e 0%, #0D0D1A 55%)' }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 px-4 pt-3 pb-3 flex items-center justify-between gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <button
          onClick={onSalir}
          className="text-white/35 hover:text-white/70 text-sm transition-colors py-1 pr-3"
        >
          ← Mapa
        </button>
        <div className="text-center min-w-0">
          <p className="font-game text-sm leading-tight" style={{ color: info.color }}>
            {info.emoji} {info.titulo}
          </p>
          <p className="text-white/30 text-[10px]">
            {comunidad.emoji} {comunidad.nombre} · Ronda {ronda + 1}/3
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/30 text-[10px] uppercase tracking-widest">Pts</p>
          <p className="font-game text-[#F2C14E] text-base leading-none">
            {puntosRondas.reduce((a, b) => a + b, 0)}
          </p>
        </div>
      </header>

      {/* Minijuego activo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {ronda === 0 && (
          <ComunidadQuiz pregunta={preguntas.quiz}    onTerminar={handleRondaTerminada} />
        )}
        {ronda === 1 && (
          <ElImpostor    pregunta={preguntas.impostor} onTerminar={handleRondaTerminada} />
        )}
        {ronda === 2 && (
          <SpeedSierra   pregunta={preguntas.speed}    onTerminar={handleRondaTerminada} />
        )}
      </div>

      {/* Overlay de transición entre rondas */}
      {enTransicion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(13,13,26,0.95)' }}
        >
          <div className="text-center px-8">
            <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-3">
              Ronda {ronda + 1}/3 completada
            </p>
            <p
              className="font-game text-[#F2C14E] text-6xl leading-none"
              style={{ textShadow: '0 0 30px rgba(242,193,78,0.6)' }}
            >
              +{puntosRondas[ronda]}
            </p>
            <p className="text-white/40 text-sm mt-2 mb-6">puntos</p>
            <p className="text-[#2FB89A] text-xs tracking-widest animate-pulse uppercase">
              Siguiente ronda...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
