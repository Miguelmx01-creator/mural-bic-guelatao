// Ruta /juego3d — Punto de entrada del videojuego educativo 3D.
// El Canvas de React Three Fiber requiere ssr: false (WebGL no existe en servidor).

import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'La Sierra en Juego 3D — BIC01 Guelatao',
  description: 'Videojuego educativo 3D sobre las comunidades de la Sierra Norte de Oaxaca.',
};

// Importación dinámica: evita que el Canvas se ejecute en el servidor (SSR)
const GameCanvas = dynamic(
  () => import('@/components/juego3d/engine/GameCanvas'),
  {
    ssr: false,
    loading: () => (
      <div
        className="w-full h-[100dvh] flex items-center justify-center"
        style={{ background: '#060410' }}
      >
        <div className="text-center">
          <div
            className="w-10 h-10 rounded-full border-[3px] border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderColor: '#F2C14E', borderTopColor: 'transparent' }}
          />
          <p
            className="font-game text-[#F2C14E] text-sm tracking-widest"
            style={{ textShadow: '0 0 10px rgba(242,193,78,0.4)' }}
          >
            CARGANDO LA SIERRA...
          </p>
        </div>
      </div>
    ),
  }
);

export default function Juego3DPage() {
  return (
    <div className="w-full h-[100dvh] overflow-hidden">
      <GameCanvas />
    </div>
  );
}
