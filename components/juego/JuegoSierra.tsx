'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginJugador  from './LoginJugador';
import MapaSierra    from './MapaSierra';
import RankingSierra from './RankingSierra';
import NivelJuego    from './NivelJuego';
import { type Jugador, actualizarProgreso } from '@/lib/jugadores';

type Vista = 'login' | 'mapa' | 'ranking' | 'nivel';

export default function JuegoSierra() {
  const [vista, setVista]           = useState<Vista>('login');
  const [jugador, setJugador]       = useState<Jugador | null>(null);
  const [nivelActivo, setNivelActivo] = useState<number | null>(null);

  function handleLogin(j: Jugador) {
    setJugador(j);
    setVista('mapa');
  }

  function handleJugarNivel(nivel: number) {
    setNivelActivo(nivel);
    setVista('nivel');
  }

  async function handleNivelCompletado(puntosGanados: number) {
    if (!jugador || nivelActivo === null) return;

    // Actualización optimista inmediata
    const optimista: Jugador = {
      ...jugador,
      puntaje:     jugador.puntaje + puntosGanados,
      nivelActual: Math.min(jugador.nivelActual + 1, 6),
    };
    setJugador(optimista);
    setNivelActivo(null);
    setVista('mapa');

    // Sincronizar con Firestore en segundo plano
    try {
      const updated = await actualizarProgreso(jugador.id, nivelActivo, puntosGanados);
      setJugador(j => j ? { ...j, puntaje: updated.puntaje, nivelActual: updated.nivelActual } : j);
    } catch (e) {
      console.error('Error al sincronizar progreso:', e);
    }
  }

  // ── Vista: nivel ──────────────────────────────────────────────────────────
  if (vista === 'nivel' && nivelActivo !== null && jugador) {
    return (
      <NivelJuego
        jugador={jugador}
        nivel={nivelActivo}
        onCompletado={handleNivelCompletado}
        onSalir={() => { setNivelActivo(null); setVista('mapa'); }}
      />
    );
  }

  // ── Vista: login ──────────────────────────────────────────────────────────
  if (vista === 'login') {
    return (
      <div className="relative">
        <Link
          href="/"
          className="absolute top-4 left-4 z-50 text-white/35 hover:text-white/70 text-sm transition-colors py-1 px-2"
        >
          ← Mural
        </Link>
        <LoginJugador onLogin={handleLogin} />
      </div>
    );
  }

  if (!jugador) return null;

  // ── Vista: ranking ────────────────────────────────────────────────────────
  if (vista === 'ranking') {
    return (
      <RankingSierra
        jugadorActual={jugador}
        onVolver={() => setVista('mapa')}
      />
    );
  }

  // ── Vista: mapa ───────────────────────────────────────────────────────────
  return (
    <MapaSierra
      jugador={jugador}
      onVerRanking={() => setVista('ranking')}
      onJugarNivel={handleJugarNivel}
    />
  );
}
