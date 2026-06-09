'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { isFirebaseConfigured } from '@/lib/firebase';
import { subscribeTarjetas, type Tarjeta } from '@/lib/firestore';
import CategoryFilter from './CategoryFilter';
import CategoryBanner from './CategoryBanner';
import CommunityColumn from './CommunityColumn';
import AddCardModal from './AddCardModal';
import ModerarModal from './ModerarModal';

export default function MuralBoard() {
  const [tarjetas, setTarjetas]         = useState<Tarjeta[]>([]);
  const [selectedCat, setSelectedCat]   = useState<string | null>(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [moderateCard, setModerateCard] = useState<Tarjeta | null>(null);
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState<string | null>(null);

  // Real-time listener
  useEffect(() => {
    if (!isFirebaseConfigured()) {
      setLoadError(
        'Faltan las variables de Firebase en el servidor. En Vercel ve a Settings → Environment Variables, agrega las 11 variables del archivo .env.example (copiando los valores de tu .env.local) y luego haz Redeploy.'
      );
      setLoading(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setLoadError((prev) =>
        prev ??
        'La conexión con Firebase tardó demasiado. Revisa las variables de entorno en Vercel y vuelve a desplegar el proyecto.'
      );
      setLoading(false);
    }, 15000);

    const unsub = subscribeTarjetas(
      (data) => {
        window.clearTimeout(timeout);
        setTarjetas(data);
        setLoadError(null);
        setLoading(false);
      },
      () => {
        window.clearTimeout(timeout);
        setLoadError(
          'No se pudo conectar con Firebase. Verifica las variables NEXT_PUBLIC_FIREBASE_* en Vercel y vuelve a desplegar.'
        );
        setLoading(false);
      }
    );

    return () => {
      window.clearTimeout(timeout);
      unsub();
    };
  }, []);

  // Apply category filter
  const filtered = useMemo(() => {
    if (!selectedCat) return tarjetas;
    return tarjetas.filter((t) => t.categoria === selectedCat);
  }, [tarjetas, selectedCat]);

  // Group by normalised community key
  const columns = useMemo(() => {
    const map = new Map<string, Tarjeta[]>();
    for (const t of filtered) {
      if (!map.has(t.comunidadKey)) map.set(t.comunidadKey, []);
      map.get(t.comunidadKey)!.push(t);
    }
    // Sort columns alphabetically
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b, 'es'))
      .map(([key, cards]) => ({ key, cards }));
  }, [filtered]);

  // Unique community keys (for autocomplete, unfiltered)
  const existingCommunities = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const t of tarjetas) {
      if (!seen.has(t.comunidadKey)) { seen.add(t.comunidadKey); result.push(t.comunidadKey); }
    }
    return result.sort((a, b) => a.localeCompare(b, 'es'));
  }, [tarjetas]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-[3px] border-pine-green border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Cargando el mural…</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg text-center space-y-3 rounded-xl border border-amber-200 bg-amber-50 px-6 py-8">
          <p className="text-3xl">⚠️</p>
          <p className="font-display font-semibold text-gray-800 text-lg">
            No se pudo cargar el mural
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{loadError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 inline-flex items-center rounded-full bg-pine-green px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Category filter bar */}
      <CategoryFilter selected={selectedCat} onChange={setSelectedCat} />

      {selectedCat && <CategoryBanner categoryId={selectedCat} />}

      {/* Board — horizontal scroll */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        {columns.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-64 text-center px-6">
            <div>
              <p className="text-4xl mb-3">🌿</p>
              <p className="font-display font-semibold text-gray-500 text-xl">
                {selectedCat ? 'Sin tarjetas en esta categoría' : 'El mural está vacío'}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {selectedCat
                  ? 'Prueba con otra categoría o agrega la primera.'
                  : 'Sé el primero en agregar una tarjeta.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-4 p-4 pb-24 items-start" style={{ width: 'max-content', minWidth: '100%' }}>
            {columns.map(({ key, cards }) => (
              <CommunityColumn
                key={key}
                comunidadKey={key}
                tarjetas={cards}
                onModerate={setModerateCard}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-5 z-40 flex items-center gap-2 bg-ochre text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:brightness-110 transition-all font-semibold text-sm"
      >
        <Plus className="w-5 h-5" />
        Agregar tarjeta
      </button>

      {/* Modals */}
      {showAdd && (
        <AddCardModal
          existingCommunities={existingCommunities}
          initialCategoria={selectedCat ?? ''}
          onClose={() => setShowAdd(false)}
        />
      )}
      {moderateCard && (
        <ModerarModal
          card={moderateCard}
          onClose={() => setModerateCard(null)}
        />
      )}
    </>
  );
}
