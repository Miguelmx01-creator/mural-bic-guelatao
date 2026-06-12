'use client';



import { Pencil } from 'lucide-react';

import { type Tarjeta } from '@/lib/firestore';

import { getCategoryById } from '@/lib/categories';

import CardImageGallery from './CardImageGallery';



interface Props {

  card: Tarjeta;

  onModerate: (card: Tarjeta) => void;

}



export default function CardItem({ card, onModerate }: Props) {

  const cat = getCategoryById(card.categoria);



  return (

    <article className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">

      <CardImageGallery

        urls={card.imagenUrls}

        alt={card.titulo}

        accentColor={cat?.bg}

      />



      <div className="p-3 space-y-1.5">

        {cat && (

          <span

            className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold tracking-wide"

            style={{ backgroundColor: cat.bg, color: cat.text }}

          >

            {cat.label}

          </span>

        )}



        <h3 className="font-semibold text-gray-900 leading-snug text-sm">

          {card.titulo}

        </h3>



        {card.descripcion && (

          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap break-words">

            {card.descripcion}

          </p>

        )}



        <div className="flex items-center justify-between pt-1">

          <span className="text-xs text-gray-400 truncate max-w-[75%]">

            — {card.autor}

          </span>

          <button

            onClick={() => onModerate(card)}

            title="Editar o eliminar (profesor)"

            className="opacity-70 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-pine-green hover:bg-pine-green/10 transition-all"

          >

            <Pencil className="w-3.5 h-3.5" />

          </button>

        </div>

      </div>

    </article>

  );

}

