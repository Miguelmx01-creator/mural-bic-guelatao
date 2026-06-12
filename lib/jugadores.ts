import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  addDoc,
  getDocs,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

export type Jugador = {
  id: string;
  nombreCompleto: string;
  semestre: string;
  puntaje: number;
  nivelActual: number;
  creadoEn: Date | null;
};

export async function buscarOCrearJugador(
  nombreCompleto: string,
  semestre: string
): Promise<Jugador> {
  const col = collection(db, 'jugadores_sierra');
  const q = query(
    col,
    where('nombreCompleto', '==', nombreCompleto.trim()),
    where('semestre', '==', semestre)
  );

  const snap = await getDocs(q);

  if (!snap.empty) {
    const doc = snap.docs[0];
    const d = doc.data();
    return {
      id:             doc.id,
      nombreCompleto: d.nombreCompleto ?? '',
      semestre:       d.semestre       ?? '',
      puntaje:        d.puntaje        ?? 0,
      nivelActual:    d.nivelActual    ?? 1,
      creadoEn:       d.creadoEn?.toDate() ?? null,
    };
  }

  const ref = await addDoc(col, {
    nombreCompleto: nombreCompleto.trim(),
    semestre,
    puntaje:     0,
    nivelActual: 1,
    creadoEn:    serverTimestamp(),
  });

  return {
    id:             ref.id,
    nombreCompleto: nombreCompleto.trim(),
    semestre,
    puntaje:     0,
    nivelActual: 1,
    creadoEn:    null,
  };
}

export async function actualizarProgreso(
  jugadorId:       string,
  nivelCompletado: number,
  puntosGanados:   number
): Promise<Pick<Jugador, 'puntaje' | 'nivelActual'>> {
  const res = await fetch('/api/progreso', {
    method:  'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ jugadorId, nivelCompletado, puntosGanados }),
  });
  if (!res.ok) throw new Error('Error al actualizar progreso');
  return res.json();
}

export function subscribeRanking(
  callback: (jugadores: Jugador[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'jugadores_sierra'),
    orderBy('puntaje', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snap) => {
    const jugadores: Jugador[] = snap.docs.map((doc) => {
      const d = doc.data();
      return {
        id:             doc.id,
        nombreCompleto: d.nombreCompleto ?? '',
        semestre:       d.semestre       ?? '',
        puntaje:        d.puntaje        ?? 0,
        nivelActual:    d.nivelActual    ?? 1,
        creadoEn:       d.creadoEn?.toDate() ?? null,
      };
    });
    callback(jugadores);
  });
}
