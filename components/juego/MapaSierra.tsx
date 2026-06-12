'use client';

import { type Jugador } from '@/lib/jugadores';

const NIVELES = [
  { nivel: 1, nombre: 'Capulalpam de Méndez',    emoji: '🏔️', color: '#F2C14E' },
  { nivel: 2, nombre: 'Chicomezuchil',            emoji: '🌿', color: '#2FB89A' },
  { nivel: 3, nombre: 'El Huamuchil',             emoji: '🌽', color: '#E5532E' },
  { nivel: 4, nombre: 'Guelatao de Juárez',       emoji: '⭐', color: '#F2C14E' },
  { nivel: 5, nombre: 'San Cristóbal Lachirioag', emoji: '🎶', color: '#2FB89A' },
];

interface Props {
  jugador:       Jugador;
  onVerRanking:  () => void;
  onJugarNivel:  (nivel: number) => void;
}

export default function MapaSierra({ jugador, onVerRanking, onJugarNivel }: Props) {
  const todosCompletados = jugador.nivelActual > 5;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0D0D1A 60%)' }}
    >
      {/* Header */}
      <header
        className="flex-shrink-0 px-4 pt-4 pb-3 flex items-center justify-between gap-2"
        style={{ borderBottom: '1px solid rgba(242,193,78,0.12)' }}
      >
        <div className="min-w-0">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-0.5">Jugador</p>
          <p
            className="font-game text-[#F2C14E] text-lg leading-tight truncate max-w-[180px]"
            style={{ textShadow: '0 0 12px rgba(242,193,78,0.4)' }}
          >
            {jugador.nombreCompleto}
          </p>
          <p className="text-white/35 text-xs">{jugador.semestre} semestre</p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-white/40 text-[10px] uppercase tracking-[0.15em] mb-0.5">Puntaje</p>
          <p
            className="font-game text-[#F2C14E] text-3xl leading-none"
            style={{ textShadow: '0 0 16px rgba(242,193,78,0.55)' }}
          >
            {jugador.puntaje.toLocaleString()}
          </p>
          <button
            onClick={onVerRanking}
            className="text-[#2FB89A] text-xs underline underline-offset-2 mt-1 active:opacity-70"
          >
            Ver ranking 🏆
          </button>
        </div>
      </header>

      {/* Mapa */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-8">
        <p className="text-center text-white/30 text-[10px] tracking-[0.25em] uppercase mb-8">
          — Mapa de la Sierra —
        </p>

        <div className="relative max-w-xs mx-auto">
          {/* Línea vertical central */}
          <div
            className="absolute left-1/2 -translate-x-px top-8 bottom-8 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.1) 15%, rgba(255,255,255,0.1) 85%, transparent)' }}
          />

          <div className="relative flex flex-col gap-8">
            {NIVELES.map((lvl, i) => {
              const bloqueado  = jugador.nivelActual < lvl.nivel;
              const esCurrent  = jugador.nivelActual === lvl.nivel && lvl.nivel <= 5;
              const completado = jugador.nivelActual > lvl.nivel;
              const jugable    = !bloqueado && lvl.nivel <= 5;
              const isRight    = i % 2 === 1;

              return (
                <div
                  key={lvl.nivel}
                  className={`flex items-center gap-5 ${isRight ? 'flex-row-reverse' : ''} ${jugable ? 'cursor-pointer' : ''}`}
                  onClick={jugable ? () => onJugarNivel(lvl.nivel) : undefined}
                >
                  {/* Nodo */}
                  <div
                    className="relative z-10 flex-shrink-0 w-[60px] h-[60px] rounded-full flex items-center justify-center text-2xl select-none"
                    style={
                      completado
                        ? {
                            background: `rgba(47,184,154,0.1)`,
                            border:     '2px solid rgba(47,184,154,0.4)',
                          }
                        : jugable
                        ? {
                            background: `radial-gradient(circle at 35% 35%, ${lvl.color}22, ${lvl.color}08)`,
                            border:     `2px solid ${lvl.color}`,
                            boxShadow:  `0 0 22px ${lvl.color}55, inset 0 0 10px ${lvl.color}11`,
                          }
                        : {
                            background: 'rgba(255,255,255,0.02)',
                            border:     '2px solid rgba(255,255,255,0.08)',
                          }
                    }
                  >
                    {completado ? '✅' : esCurrent ? lvl.emoji : '🔒'}
                  </div>

                  {/* Etiqueta */}
                  <div className={`flex-1 min-w-0 ${isRight ? 'text-right' : ''}`}>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.12em] mb-0.5"
                      style={{
                        color: completado ? 'rgba(47,184,154,0.6)' :
                               esCurrent  ? lvl.color :
                                            'rgba(255,255,255,0.2)',
                      }}
                    >
                      Nivel {lvl.nivel}
                    </p>
                    <p
                      className="text-sm font-semibold leading-tight"
                      style={{
                        color: bloqueado ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.85)',
                      }}
                    >
                      {lvl.nombre}
                    </p>

                    {completado && (
                      <span
                        className="inline-block mt-1.5 font-game text-[#0D0D1A] text-[11px] px-3 py-0.5 rounded-full"
                        style={{ background: 'rgba(47,184,154,0.7)' }}
                      >
                        REJUGAR ↺
                      </span>
                    )}

                    {esCurrent && (
                      <span
                        className="inline-block mt-1.5 font-game text-[#0D0D1A] text-[11px] px-3 py-0.5 rounded-full animate-pulse"
                        style={{ background: lvl.color }}
                      >
                        JUGAR ▶
                      </span>
                    )}

                    {bloqueado && (
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.18)' }}>
                        Completa el nivel anterior
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {todosCompletados ? (
          <div
            className="mt-10 mx-auto max-w-xs text-center rounded-2xl py-5 px-4"
            style={{ background: 'rgba(242,193,78,0.07)', border: '1px solid rgba(242,193,78,0.25)' }}
          >
            <p className="font-game text-[#F2C14E] text-xl" style={{ textShadow: '0 0 16px rgba(242,193,78,0.4)' }}>
              🏆 SIERRA CONQUISTADA
            </p>
            <p className="text-white/40 text-xs mt-2">
              Toca cualquier nivel para volver a jugar y mejorar tu puntaje
            </p>
          </div>
        ) : (
          <p className="text-center text-white/20 text-xs mt-12 pb-6">
            Toca JUGAR ▶ para comenzar tu nivel
          </p>
        )}
      </div>
    </div>
  );
}
