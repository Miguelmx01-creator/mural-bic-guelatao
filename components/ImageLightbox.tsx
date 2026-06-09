'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  urls: string[];
  initialIndex: number;
  alt: string;
  onClose: () => void;
}

export default function ImageLightbox({ urls, initialIndex, alt, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);

  const hasMultiple = urls.length > 1;
  const currentUrl = urls[index];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    setScale(1);
  }, [index]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(urls.length - 1, i + 1));
  }, [urls.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, goPrev, goNext]);

  const zoomIn = () => setScale((s) => Math.min(4, +(s + 0.5).toFixed(1)));
  const zoomOut = () => setScale((s) => Math.max(1, +(s - 0.5).toFixed(1)));
  const resetZoom = () => setScale(1);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStart.current = { distance: Math.hypot(dx, dy), scale };
      touchStart.current = null;
      return;
    }
    if (e.touches.length === 1 && scale === 1) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStart.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.hypot(dx, dy);
      const ratio = distance / pinchStart.current.distance;
      setScale(Math.min(4, Math.max(1, +(pinchStart.current.scale * ratio).toFixed(2))));
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    pinchStart.current = null;
    if (!touchStart.current || scale !== 1 || !hasMultiple) {
      touchStart.current = null;
      return;
    }
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const elapsed = Date.now() - touchStart.current.time;
    touchStart.current = null;

    if (elapsed > 400 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx > 50) goPrev();
    else if (dx < -50) goNext();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Visor de imágenes"
    >
      {/* Barra superior */}
      <div className="flex items-center justify-between px-3 py-3 text-white flex-shrink-0">
        <div className="min-w-0 flex-1 pr-3">
          <p className="text-sm font-medium truncate">{alt}</p>
          {hasMultiple && (
            <p className="text-xs text-white/60">
              {index + 1} de {urls.length}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
          aria-label="Cerrar visor"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Imagen */}
      <div
        className="flex-1 relative flex items-center justify-center min-h-0 overflow-auto touch-pan-x touch-pan-y"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {hasMultiple && index > 0 && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden sm:flex"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentUrl}
          alt={`${alt} (${index + 1}/${urls.length})`}
          className="max-h-[75dvh] max-w-[95vw] object-contain select-none transition-transform duration-150"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          draggable={false}
          onDoubleClick={() => (scale === 1 ? setScale(2) : resetZoom())}
        />

        {hasMultiple && index < urls.length - 1 && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors hidden sm:flex"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Controles */}
      <div className="flex-shrink-0 px-4 py-4 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 1}
            className="p-2.5 rounded-full bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
            aria-label="Alejar"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm tabular-nums w-14 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 4}
            className="p-2.5 rounded-full bg-white/10 text-white disabled:opacity-40 hover:bg-white/20 transition-colors"
            aria-label="Acercar"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Restablecer zoom"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {hasMultiple && (
          <div className="flex gap-1.5 overflow-x-auto justify-center pb-1">
            {urls.map((url, i) => (
              <button
                key={`thumb-${url}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === index ? 'border-ochre opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <p className="text-center text-[11px] text-white/50">
          {hasMultiple ? 'Desliza para cambiar · ' : ''}
          Pellizca o usa +/− para zoom · Doble toque para ampliar
        </p>
      </div>
    </div>
  );
}
