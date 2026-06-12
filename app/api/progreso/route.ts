import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function PATCH(req: NextRequest) {
  let body: { jugadorId?: unknown; nivelCompletado?: unknown; puntosGanados?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const { jugadorId, nivelCompletado, puntosGanados } = body;

  if (
    typeof jugadorId      !== 'string' || !jugadorId ||
    typeof nivelCompletado !== 'number' ||
    typeof puntosGanados   !== 'number'
  ) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
  }

  if (nivelCompletado < 1 || nivelCompletado > 5 || puntosGanados < 0 || puntosGanados > 500) {
    return NextResponse.json({ error: 'Valores fuera de rango' }, { status: 400 });
  }

  const db  = getAdminDb();
  const ref = db.collection('jugadores_sierra').doc(jugadorId);
  const snap = await ref.get();

  if (!snap.exists) {
    return NextResponse.json({ error: 'Jugador no encontrado' }, { status: 404 });
  }

  const actual     = snap.data()!;
  const nuevoNivel = Math.min(
    Math.max(actual.nivelActual ?? 1, nivelCompletado + 1),
    6 // cap: 6 = todos completados
  );

  await ref.update({
    puntaje:     FieldValue.increment(puntosGanados),
    nivelActual: nuevoNivel,
  });

  const updated = await ref.get();
  const d       = updated.data()!;

  return NextResponse.json({ puntaje: d.puntaje, nivelActual: d.nivelActual });
}
