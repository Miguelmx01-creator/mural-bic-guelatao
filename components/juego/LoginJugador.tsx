'use client';

import { useState } from 'react';
import { buscarOCrearJugador, type Jugador } from '@/lib/jugadores';

interface Props {
  onLogin: (jugador: Jugador) => void;
}

const SEMESTRES = ['Segundo', 'Cuarto', 'Sexto'];

export default function LoginJugador({ onLogin }: Props) {
  const [nombre, setNombre]   = useState('');
  const [semestre, setSemestre] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !semestre) return;
    setLoading(true);
    setError('');
    try {
      const jugador = await buscarOCrearJugador(nombre, semestre);
      onLogin(jugador);
    } catch {
      setError('Error al conectar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5"
      style={{ background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0D0D1A 60%)' }}
    >
      <div className="w-full max-w-sm">
        {/* Título */}
        <div className="text-center mb-8">
          <p className="text-[#2FB89A] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Reto 2do Semestre
          </p>
          <h1
            className="font-game text-[#F2C14E] text-5xl leading-none tracking-wide"
            style={{ textShadow: '0 0 30px rgba(242,193,78,0.45)' }}
          >
            LA SIERRA<br />EN JUEGO
          </h1>
          <p className="text-white/40 text-xs mt-3 tracking-widest">
            Sierra Norte de Oaxaca
          </p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(242,193,78,0.25)',
            boxShadow: '0 0 40px rgba(242,193,78,0.06)',
          }}
        >
          <div>
            <label className="text-[#F2C14E]/70 text-[10px] font-bold tracking-[0.15em] uppercase block mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Escribe tu nombre..."
              autoComplete="off"
              className="w-full rounded-xl px-4 py-3 text-white placeholder-white/25 text-sm outline-none focus:ring-1 focus:ring-[#F2C14E]/40 transition"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
              required
            />
          </div>

          <div>
            <label className="text-[#F2C14E]/70 text-[10px] font-bold tracking-[0.15em] uppercase block mb-2">
              Semestre
            </label>
            <select
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-[#F2C14E]/40 transition"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: semestre ? 'white' : 'rgba(255,255,255,0.3)',
              }}
              required
            >
              <option value="" disabled style={{ background: '#1a1a2e' }}>
                Selecciona tu semestre
              </option>
              {SEMESTRES.map((s) => (
                <option key={s} value={s} style={{ background: '#1a1a2e', color: 'white' }}>
                  {s} Semestre
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-[#E5532E] text-xs text-center py-1">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !nombre.trim() || !semestre}
            className="w-full font-game text-[#0D0D1A] py-4 rounded-xl text-lg tracking-wider transition-all duration-200 disabled:opacity-40 active:scale-[0.98]"
            style={{
              background: '#F2C14E',
              boxShadow: loading ? 'none' : '0 4px 24px rgba(242,193,78,0.35)',
            }}
          >
            {loading ? 'CARGANDO...' : 'ENTRAR A LA SIERRA'}
          </button>
        </form>
      </div>
    </div>
  );
}
