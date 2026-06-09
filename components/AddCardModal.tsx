'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Loader2 } from 'lucide-react';
import { CATEGORIES, getCategoryById } from '@/lib/categories';
import { crearTarjeta } from '@/lib/firestore';
import { normalizeComunidad } from '@/lib/utils';
import { uploadToCloudinary } from '@/lib/cloudinary';
import ImageUploadField from './ImageUploadField';

interface Props {
  existingCommunities: string[];
  initialCategoria?: string;
  onClose: () => void;
}

const FIELD = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pine-green/40 focus:border-pine-green/60 transition';

export default function AddCardModal({ existingCommunities, initialCategoria = '', onClose }: Props) {
  const [comunidadRaw, setComunidadRaw]   = useState('');
  const [categoria, setCategoria]         = useState(initialCategoria);
  const [titulo, setTitulo]               = useState('');
  const [descripcion, setDescripcion]     = useState('');
  const [autor, setAutor]                 = useState('');
  const [imageFile, setImageFile]         = useState<File | null>(null);
  const [imagePreview, setImagePreview]   = useState<string | null>(null);
  const [suggestions, setSuggestions]     = useState<string[]>([]);
  const [showSug, setShowSug]             = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const selectedCat = getCategoryById(categoria);

  useEffect(() => {
    const q = normalizeComunidad(comunidadRaw);
    if (!q) { setSuggestions([]); setShowSug(false); return; }
    const matches = existingCommunities.filter((c) =>
      c.toLowerCase().includes(q.toLowerCase())
    );
    setSuggestions(matches);
    setShowSug(matches.length > 0);
  }, [comunidadRaw, existingCommunities]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleImageClear = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comunidadRaw.trim() || !categoria || !titulo.trim() || !autor.trim()) {
      setError('Rellena los campos obligatorios (*).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let imagenUrl: string | null = null;
      if (imageFile) imagenUrl = await uploadToCloudinary(imageFile);
      await crearTarjeta({
        comunidadRaw: comunidadRaw.trim(),
        categoria,
        titulo:       titulo.trim(),
        descripcion:  descripcion.trim(),
        autor:        autor.trim(),
        imagenUrl,
      });
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg.includes('Cloudinary') || msg.includes('subir') ? msg : `No se pudo publicar: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-cream w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ochre/25 sticky top-0 bg-cream z-10">
          <h2 className="font-display font-bold text-pine-green text-lg">Agregar tarjeta</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-ochre/20 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Comunidad */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Comunidad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={comunidadRaw}
              onChange={(e) => setComunidadRaw(e.target.value)}
              onBlur={() => setTimeout(() => setShowSug(false), 160)}
              onFocus={() => setShowSug(suggestions.length > 0)}
              placeholder="Ej: Yaneri, Analco, Lachatao…"
              autoComplete="off"
              className={FIELD}
            />
            {showSug && (
              <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-44 overflow-y-auto">
                {suggestions.map((s) => (
                  <li
                    key={s}
                    onMouseDown={() => { setComunidadRaw(s); setShowSug(false); }}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-pine-green/10 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-pine-green flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={FIELD}>
              <option value="">Elige una categoría…</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            {selectedCat && (
              <span
                className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: selectedCat.bg, color: selectedCat.text }}
              >
                {selectedCat.label}
              </span>
            )}
          </div>

          {/* Imagen — justo después de categoría, con pista por apartado */}
          {categoria ? (
            <ImageUploadField
              preview={imagePreview}
              onSelect={handleImageSelect}
              onClear={handleImageClear}
              onError={setError}
              accentColor={selectedCat?.bg}
              hint={selectedCat?.imageHint}
            />
          ) : (
            <p className="text-xs text-gray-400 italic bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              Elige una categoría para ver qué tipo de foto conviene subir.
            </p>
          )}

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="¿Qué documentas de tu comunidad?"
              maxLength={120}
              className={FIELD}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Escribe aquí tu aportación…"
              rows={3}
              maxLength={600}
              className={`${FIELD} resize-none`}
            />
            <div className="flex items-start justify-between gap-2 mt-1">
              {categoria ? (
                <p className="text-xs text-pine-green/80 bg-pine-green/8 border border-pine-green/20 rounded-lg px-2 py-1.5 leading-snug flex-1">
                  💡 {selectedCat?.hint}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic flex-1">
                  Elige una categoría para ver una guía de qué escribir.
                </p>
              )}
              <span className="text-xs text-gray-400 flex-shrink-0">{descripcion.length}/600</span>
            </div>
          </div>

          {/* Autor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tu nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="¿Cómo te llamas?"
              maxLength={80}
              className={FIELD}
            />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-pine-green text-cream text-sm font-semibold hover:bg-pine-green/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Publicando…' : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
