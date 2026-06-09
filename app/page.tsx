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

      {/* ── Main board ── */}
      <main className="flex flex-col flex-1 overflow-hidden">
        <MuralBoard />
      </main>
    </div>
  );
}
