'use client';

import { useRef } from 'react';
import { X, Upload, ImageIcon } from 'lucide-react';

interface Props {
  preview: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
  onError: (msg: string) => void;
  accentColor?: string;
  hint?: string;
  label?: string;
}

export default function ImageUploadField({
  preview,
  onSelect,
  onClear,
  onError,
  accentColor = '#2D5A1B',
  hint,
  label = 'Imagen',
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      onError('Solo se permiten archivos de imagen.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onError('La imagen no debe pesar más de 10 MB.');
      return;
    }
    onSelect(file);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} <span className="text-gray-400 font-normal">(opcional, recomendada)</span>
      </label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border-2" style={{ borderColor: accentColor }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Vista previa" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={() => {
              onClear();
              if (fileRef.current) fileRef.current.value = '';
            }}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-700 text-xs font-medium px-2.5 py-1 rounded-lg shadow"
          >
            Cambiar foto
          </button>
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
            Elegir de galería o tomar foto
          </span>
          <span className="text-xs text-gray-400">JPG, PNG · máx. 10 MB</span>
        </button>
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
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
