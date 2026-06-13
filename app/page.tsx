import Link from 'next/link';
import { Mountain } from 'lucide-react';
import MuralBoard from '@/components/MuralBoard';

export default function HomePage() {
  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      {/* ── Header ── */}
      <header className="flex-shrink-0 bg-pine-green text-cream px-4 py-3 flex items-center gap-3 shadow-md">
        <Mountain className="w-6 h-6 text-ochre flex-shrink-0" />
        <div className="min-w-0">
          <h1 className="font-display font-bold text-lg leading-tight tracking-tight truncate">
            Mural Comunitario BIC01 Guelatao de Juárez
          </h1>
          <p className="text-cream/65 text-xs truncate">Sierra Norte de Oaxaca</p>
          <p className="text-ochre/90 text-xs leading-tight mt-0.5 truncate">
            ¿Cómo influye mi contexto en mi desarrollo y qué puedo hacer para mejorarlo?
          </p>
        </div>
      </header>

      {/* ── Game banners ── */}
      <div
        className="flex-shrink-0 flex"
        style={{ borderBottom: '1px solid rgba(242,193,78,0.2)' }}
      >
        {/* Juego 2D */}
        <Link
          href="/juego"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 active:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(90deg, #0D0D1A 0%, #1a0a2e 100%)' }}
        >
          <span
            className="font-game text-[#F2C14E] text-sm tracking-widest"
            style={{ textShadow: '0 0 10px rgba(242,193,78,0.5)' }}
          >
            🎮 La Sierra 2D
          </span>
        </Link>
        {/* Separador */}
        <div style={{ width: 1, background: 'rgba(242,193,78,0.15)' }} />
        {/* Juego 3D */}
        <Link
          href="/juego3d"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 active:opacity-80 transition-opacity"
          style={{ background: 'linear-gradient(90deg, #1a0a2e 0%, #0D1A0D 100%)' }}
        >
          <span
            className="font-game text-[#2FB89A] text-sm tracking-widest"
            style={{ textShadow: '0 0 10px rgba(47,184,154,0.5)' }}
          >
            🌐 La Sierra 3D
          </span>
          <span className="text-[10px] text-[#2FB89A]/50 font-body">NUEVO</span>
        </Link>
      </div>

      {/* ── Main board ── */}
      <main className="flex flex-col flex-1 overflow-hidden">
        <MuralBoard />
      </main>
    </div>
  );
}
