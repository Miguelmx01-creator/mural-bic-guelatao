'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginJugador from './LoginJugador';
import MapaSierra from './MapaSierra';
import RankingSierra from './RankingSierra';
import { type Jugador } from '@/lib/jugadores';

type Vista = 'login' | 'mapa' | 'ranking';

export default function JuegoSierra() {
  const [vista, setVista]     = useState<Vista>('login');
  const [jugador, setJugador] = useState<Jugador | null>(null);

  function handleLogin(j: Jugador) {
    setJugador(j);
    setVista('mapa');
  }

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

  if (vista === 'ranking') {
    return (
      <RankingSierra
        jugadorActual={jugador}
        onVolver={() => setVista('mapa')}
      />
    );
  }

  return (
    <MapaSierra
      jugador={jugador}
      onVerRanking={() => setVista('ranking')}
    />
  );
}
