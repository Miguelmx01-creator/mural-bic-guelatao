import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import { normalizeComunidad } from './utils';
import { parseImagenUrls, toFirestoreImages } from './tarjeta-images';

export type Tarjeta = {
  id: string;
  comunidadRaw: string;
  comunidadKey: string;
  categoria: string;
  titulo: string;
  descripcion: string;
  autor: string;
  imagenUrls: string[];
  creadoEn: Date | null;
};

export type NuevaTarjeta = Omit<Tarjeta, 'id' | 'comunidadKey' | 'creadoEn'>;

/** Real-time subscription — returns unsubscribe function */
export function subscribeTarjetas(
  callback: (tarjetas: Tarjeta[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(collection(db, 'tarjetas'), orderBy('creadoEn', 'asc'));

  return onSnapshot(
    q,
    (snap) => {
      const tarjetas: Tarjeta[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id:           doc.id,
          comunidadRaw: d.comunidadRaw ?? '',
          comunidadKey: d.comunidadKey ?? '',
          categoria:    d.categoria   ?? '',
          titulo:       d.titulo      ?? '',
          descripcion:  d.descripcion ?? '',
          autor:        d.autor       ?? '',
          imagenUrls:   parseImagenUrls(d),
          creadoEn:     d.creadoEn?.toDate() ?? null,
        };
      });
      callback(tarjetas);
    },
    (err) => {
      console.error('[Firestore] subscribeTarjetas:', err);
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  );
}

export async function crearTarjeta(nueva: NuevaTarjeta): Promise<void> {
  const images = toFirestoreImages(nueva.imagenUrls);
  await addDoc(collection(db, 'tarjetas'), {
    ...nueva,
    ...images,
    comunidadKey: normalizeComunidad(nueva.comunidadRaw),
    creadoEn:     serverTimestamp(),
  });
}
