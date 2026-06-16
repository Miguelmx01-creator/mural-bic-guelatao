'use client';

import { useEffect, useState } from 'react';
import { subscribeRanking, type Jugador } from '@/lib/jugadores';

interface Props {
  jugadorActual?: Jugador | null;
  onVolver: () => void;
}

const PODIO_COLORS  = ['#F2C14E', '#C0C0C0', '#CD7F32'];
const PODIO_MEDALS  = ['🥇', '🥈', '🥉'];
const PODIO_HEIGHTS = [100, 80, 65];

export default function RankingSierra({ jugadorActual, onVolver }: Props) {
  const [ranking, setRanking] = useState<Jugador[]>([]);

  useEffect(() => {
    const unsub = subscribeRanking(setRanking);
    return () => unsub();
  }, []);

  const podio = ranking.slice(0, 3);
  const resto = ranking.slice(3);
  const podioDisplay = [podio[1], podio[0], podio[2]];
  const podioOrder   = [1, 0, 2];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0D0D1A 60%)' }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 px-4 pt-4 pb-3 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(242,193,78,0.12)' }}
      >
        <button
          onClick={onVolver}
          className="text-white/50 hover:text-white text-xl w-8 h-8 flex items-center justify-center rounded-lg active:bg-white/10 transition"
        >
          ←
        </button>
        <div>
          <h2 className="font-game text-[#F2C14E] text-2xl tracking-wider"
            style={{ textShadow: '0 0 12px rgba(242,193,78,0.4)' }}>
            RANKING
          </h2>
          <p className="text-white/30 text-[10px] tracking-widest -mt-0.5">Lenguas Indígenas II</p>
        </div>
        <span className="ml-auto text-white/20 text-[10px]">en tiempo real</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6">

        {/* Podio */}
        {podio.length > 0 && (
          <div className="flex items-end justify-center gap-2 mb-8 px-2">
            {podioDisplay.map((jugador, vi) => {
              if (!jugador) return <div key={vi} className="w-[30%]" />;
              const ri      = podioOrder[vi];
              const color   = PODIO_COLORS[ri];
              const medal   = PODIO_MEDALS[ri];
              const height  = PODIO_HEIGHTS[ri];
              const esActual = jugadorActual && jugador.id === jugadorActual.id;
              return (
                <div key={jugador.id} className="flex flex-col items-center gap-1 w-[30%]">
                  <span className="text-2xl">{medal}</span>
                  <div
                    className="w-full rounded-t-xl flex flex-col items-center justify-end py-3 px-1 gap-0.5"
                    style={{
                      minHeight: height,
                      background: `rgba(${ri===0?'242,193,78':ri===1?'192,192,192':'205,127,50'},0.1)`,
                      border:     `1px solid ${color}40`,
                      boxShadow:  ri===0 ? '0 0 20px rgba(242,193,78,0.12)' : 'none',
                    }}
                  >
                    <p className="text-white text-[11px] text-center font-bold leading-tight px-1 break-words">
                      {jugador.nombreCompleto.split(' ').slice(0, 2).join(' ')}
                      {esActual && <span className="block text-[9px]" style={{ color }}>tú</span>}
                    </p>
                    <p className="text-white/40 text-[10px]">{jugador.semestre}°</p>
                    <p className="font-game text-xl leading-none" style={{ color,
                      textShadow: ri===0 ? '0 0 10px rgba(242,193,78,0.5)' : 'none' }}>
                      {jugador.puntaje}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Lista completa 4-20 */}
        {resto.length > 0 && (
          <div className="space-y-2">
            {resto.map((j, i) => {
              const esActual = jugadorActual && j.id === jugadorActual.id;
              return (
                <div key={j.id} className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: esActual ? 'rgba(242,193,78,0.08)' : 'rgba(255,255,255,0.03)',
                    border:     esActual ? '1px solid rgba(242,193,78,0.25)' : '1px solid rgba(255,255,255,0.05)',
                  }}>
                  <span className="text-white/35 font-game text-sm w-7 text-right flex-shrink-0">
                    {i + 4}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">
                      {j.nombreCompleto}
                      {esActual && <span className="text-[#F2C14E] text-xs ml-1.5 font-normal">(tú)</span>}
                    </p>
                    <p className="text-white/35 text-xs">{j.semestre} semestre</p>
                  </div>
                  <span className="font-game text-sm flex-shrink-0"
                    style={{ color: esActual ? '#F2C14E' : 'rgba(255,255,255,0.5)' }}>
                    {j.puntaje}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {ranking.length === 0 && (
          <p className="text-center text-white/25 text-sm mt-16">Cargando ranking...</p>
        )}

        {/* Jugador fuera del top 20 */}
        {jugadorActual && ranking.length > 0 && !ranking.find(j => j.id === jugadorActual!.id) && (
          <div className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(242,193,78,0.08)', border: '1px solid rgba(242,193,78,0.25)' }}>
            <span className="text-[#F2C14E]/50 font-game text-sm w-7 text-right">…</span>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">
                {jugadorActual.nombreCompleto}
                <span className="text-[#F2C14E] text-xs ml-1.5 font-normal">(tú)</span>
              </p>
              <p className="text-white/35 text-xs">{jugadorActual.semestre} semestre</p>
            </div>
            <span className="font-game text-sm text-[#F2C14E]">{jugadorActual.puntaje}</span>
          </div>
        )}

        <p className="text-center text-white/15 text-xs mt-8 pb-6">Top 20 · actualización en tiempo real</p>
      </div>
    </div>
  );
}
