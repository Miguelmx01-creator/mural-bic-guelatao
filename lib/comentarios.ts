import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

export type Comentario = {
  id: string;
  comunidadKey: string;
  autor: string;
  texto: string;
  creadoEn: Date | null;
  editadoEn: Date | null;
};

export function subscribeComentarios(
  comunidadKey: string,
  callback: (comentarios: Comentario[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(db, 'comentarios'),
    where('comunidadKey', '==', comunidadKey),
    orderBy('creadoEn', 'asc')
  );

  return onSnapshot(
    q,
    (snap) => {
      const comentarios: Comentario[] = snap.docs.map((doc) => {
        const d = doc.data();
        return {
          id:           doc.id,
          comunidadKey: d.comunidadKey ?? '',
          autor:        d.autor        ?? '',
          texto:        d.texto        ?? '',
          creadoEn:     d.creadoEn?.toDate() ?? null,
          editadoEn:    d.editadoEn?.toDate() ?? null,
        };
      });
      callback(comentarios);
    },
    (err) => {
      console.error('[Firestore] subscribeComentarios:', err);
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  );
}

export async function crearComentario(input: {
  comunidadKey: string;
  autor: string;
  texto: string;
  editToken: string;
}): Promise<string> {
  const ref = await addDoc(collection(db, 'comentarios'), {
    comunidadKey: input.comunidadKey,
    autor:        input.autor.trim(),
    texto:        input.texto.trim(),
    editToken:    input.editToken,
    creadoEn:     serverTimestamp(),
    editadoEn:    null,
  });
  return ref.id;
}
