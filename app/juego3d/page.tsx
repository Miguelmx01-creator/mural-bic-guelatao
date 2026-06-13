import type { Metadata } from 'next';
import GameLoader from './GameLoader';

export const metadata: Metadata = {
  title: 'La Sierra en Juego 3D — BIC01 Guelatao',
  description: 'Videojuego educativo 3D sobre las comunidades de la Sierra Norte de Oaxaca.',
};

export default function Juego3DPage() {
  return <GameLoader />;
}
