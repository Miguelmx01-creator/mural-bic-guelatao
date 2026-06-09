'use client';

import { useRef } from 'react';
import { X, Upload, ImageIcon, Plus } from 'lucide-react';
import { MAX_IMAGES_PER_CARD } from '@/lib/tarjeta-images';

export type ImagePreviewItem = {
  id: string;
  src: string;
};

interface Props {
  items: ImagePreviewItem[];
  onAddFiles: (files: File[]) => void;
  onRemove: (id: string) => void;
  onError: (msg: string) => void;
  accentColor?: string;
  hint?: string;
  label?: string;
  maxImages?: number;
}

export default function MultiImageUploadField({
  items,
  onAddFiles,
  onRemove,
  onError,
  accentColor = '#2D5A1B',
  hint,
  label = 'Imágenes',
  maxImages = MAX_IMAGES_PER_CARD,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canAdd = items.length < maxImages;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (fileRef.current) fileRef.current.value = '';

    if (selected.length === 0) return;

    const valid: File[] = [];
    for (const file of selected) {
      if (!file.type.startsWith('image/')) {
        onError('Solo se permiten archivos de imagen.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        onError('Cada imagen debe pesar menos de 10 MB.');
        return;
      }
      valid.push(file);
    }

    const room = maxImages - items.length;
    if (room <= 0) {
      onError(`Máximo ${maxImages} imágenes por tarjeta.`);
      return;
    }

    onAddFiles(valid.slice(0, room));
    if (valid.length > room) {
      onError(`Solo se agregaron ${room} imagen(es). Máximo ${maxImages} por tarjeta.`);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}{' '}
        <span className="text-gray-400 font-normal">
          (opcional, hasta {maxImages})
        </span>
      </label>

      {items.length > 0 ? (
        <div
          className="flex gap-2 overflow-x-auto pb-2 scroll-smooth touch-pan-x"
          style={{ scrollbarWidth: 'thin' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden border-2"
              style={{ borderColor: accentColor }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                aria-label="Quitar imagen"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {canAdd && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex-shrink-0 w-28 h-28 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-gray-500 hover:bg-white/80 transition-colors"
              style={{ borderColor: `${accentColor}66` }}
            >
              <Plus className="w-5 h-5" />
              <span className="text-[10px] font-medium px-1 text-center">Agregar</span>
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full rounded-xl border-2 border-dashed p-5 flex flex-col items-center justify-center gap-2 transition-colors hover:bg-white/80"
          style={{ borderColor: `${accentColor}66` }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            <ImageIcon className="w-6 h-6" />
          </div>
          <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            Elegir de galería o tomar fotos
          </span>
          <span className="text-xs text-gray-400">JPG, PNG · máx. 10 MB c/u</span>
        </button>
      )}

      {items.length > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          {items.length}/{maxImages} · desliza para ver las miniaturas
        </p>
      )}

      {hint && (
        <p className="text-xs text-gray-500 mt-2 leading-snug">
          📷 {hint}
        </p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
