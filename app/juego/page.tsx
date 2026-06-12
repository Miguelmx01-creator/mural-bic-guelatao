import type { Metadata } from 'next';
import JuegoSierra from '@/components/juego/JuegoSierra';

export const metadata: Metadata = {
  title: 'La Sierra en Juego — BIC01',
  description: 'Reto 2do Semestre: explora las comunidades de la Sierra Norte de Oaxaca',
};

export default function JuegoPage() {
  return <JuegoSierra />;
}
