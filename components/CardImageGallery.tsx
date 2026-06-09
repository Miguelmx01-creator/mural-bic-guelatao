'use client';

import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface Props {
  urls: string[];
  alt: string;
  accentColor?: string;
}

export default function CardImageGallery({ urls, alt, accentColor }: Props) {
  if (urls.length === 0) {
    if (!accentColor) return null;
    return (
      <div
        className="relative w-full h-28 flex flex-col items-center justify-center gap-1.5"
        style={{ background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}08 100%)` }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
        >
          <ImageIcon className="w-5 h-5 opacity-70" />
        </div>
        <span className="text-[10px] text-gray-400 px-3 text-center">Sin fotos</span>
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {urls.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="relative flex-shrink-0 w-full h-44 snap-center"
          >
            <Image
              src={url}
              alt={`${alt} (${index + 1}/${urls.length})`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 288px"
            />
            {accentColor && (
              <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />
            )}
          </div>
        ))}
      </div>

      {urls.length > 1 && (
        <>
          <div className="absolute bottom-2 right-2 rounded-full bg-black/55 text-white text-[10px] font-medium px-2 py-0.5">
            Desliza →
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {urls.map((url, index) => (
              <span
                key={`dot-${url}-${index}`}
                className="w-1.5 h-1.5 rounded-full bg-white/80 shadow"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
