'use client';

import { type Tarjeta } from '@/lib/firestore';
import CardItem from './CardItem';

interface Props {
  comunidadKey: string;
  tarjetas: Tarjeta[];
  onModerate: (card: Tarjeta) => void;
}

export default function CommunityColumn({ comunidadKey, tarjetas, onModerate }: Props) {
  return (
    <div className="flex-shrink-0 w-72 flex flex-col">
      {/* Column header — sticky within the scroll container */}
      <div className="bg-pine-green text-cream rounded-xl px-4 py-3 flex items-center justify-between mb-3 sticky top-4 z-10 shadow-md">
        <h2 className="font-display font-bold text-base truncate leading-tight">
          {comunidadKey}
        </h2>
        <span className="ml-2 flex-shrink-0 bg-cream/20 text-cream text-xs font-semibold px-2 py-0.5 rounded-full">
          {tarjetas.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 pb-6">
        {tarjetas.map((card) => (
          <CardItem key={card.id} card={card} onModerate={onModerate} />
        ))}
      </div>
    </div>
  );
}
