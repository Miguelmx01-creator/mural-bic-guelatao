'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Trash2, Loader2, Pencil } from 'lucide-react';
import { type Tarjeta } from '@/lib/firestore';
import { CATEGORIES, getCategoryById } from '@/lib/categories';
import { uploadToCloudinary } from '@/lib/cloudinary';
import MultiImageUploadField, { type ImagePreviewItem } from './MultiImageUploadField';

type ImageItem = ImagePreviewItem & { file?: File };

interface Props {
  card: Tarjeta;
  onClose: () => void;
}

const FIELD =
  'w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pine-green/40 focus:border-pine-green/60 transition';

export default function ModerarModal({ card, onClose }: Props) {
  const [pin, setPin]                   = useState('');
  const [categoria, setCategoria]       = useState(card.categoria);
  const [titulo, setTitulo]             = useState(card.titulo);
  const [descripcion, setDescripcion]   = useState(card.descripcion);
  const [autor, setAutor]               = useState(card.autor);
  const [imageItems, setImageItems]     = useState<ImageItem[]>(() =>
    card.imagenUrls.map((url) => ({ id: url, src: url }))
  );
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const selectedCat = getCategoryById(categoria);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleAddFiles = useCallback((files: File[]) => {
    setError(null);
    setImageItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: crypto.randomUUID(),
        src: URL.createObjectURL(file),
        file,
      })),
    ]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImageItems((prev) => {
      const removed = prev.find((item) => item.id === id);
      if (removed?.src.startsWith('blob:')) URL.revokeObjectURL(removed.src);
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const handleSave = async () => {
    if (!pin) { setError('Escribe el PIN de moderador.'); return; }
    if (!titulo.trim() || !autor.trim() || !categoria) {
      setError('Título, autor y categoría son obligatorios.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const imagenUrls: string[] = [];
      for (const item of imageItems) {
        if (item.file) {
          imagenUrls.push(await uploadToCloudinary(item.file));
        } else if (item.src.startsWith('https://')) {
          imagenUrls.push(item.src);
        }
      }

      const updates: Record<string, string | string[] | null> = {
        categoria,
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        autor: autor.trim(),
        imagenUrls,
      };

      const res = await fetch('/api/moderar', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, cardId: card.id, updates }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al guardar.');
      } else {
        onClose();
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg.includes('Cloudinary') || msg.includes('subir') ? msg : `No se pudo guardar: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!pin) { setError('Escribe el PIN de moderador.'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/moderar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, cardId: card.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Error al eliminar.');
      } else {
        onClose();
      }
    } catch {
      setError('Error de conexión.');
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-cream w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ochre/25 sticky top-0 bg-cream z-10">
          <div className="flex items-center gap-2 text-pine-green">
            <Pencil className="w-5 h-5" />
            <h2 className="font-semibold text-base">Moderar tarjeta</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-ochre/20 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={FIELD}>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <MultiImageUploadField
            items={imageItems}
            onAddFiles={handleAddFiles}
            onRemove={handleRemoveImage}
            onError={setError}
            accentColor={selectedCat?.bg}
            hint={selectedCat?.imageHint}
            label="Imágenes de la tarjeta"
          />

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Título</label>
            <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={120} className={FIELD} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} maxLength={600} className={`${FIELD} resize-none`} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Autor</label>
            <input type="text" value={autor} onChange={(e) => setAutor(e.target.value)} maxLength={80} className={FIELD} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">PIN de moderador</label>
            <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••••" className={FIELD} />
          </div>

          {error && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button type="button" onClick={handleSave} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-pine-green text-cream text-sm font-semibold hover:bg-pine-green/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading && !confirmDelete ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Guardar
            </button>
          </div>

          {!confirmDelete ? (
            <button type="button" onClick={() => { setError(null); setConfirmDelete(true); }} className="w-full px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Eliminar tarjeta
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-2">
              <p className="text-sm text-red-800">¿Eliminar esta tarjeta? No se puede deshacer.</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setConfirmDelete(false)} className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm">No</button>
                <button type="button" onClick={handleDelete} disabled={loading} className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Sí, eliminar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
