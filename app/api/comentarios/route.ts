import { NextRequest } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

function tokenOk(provided: unknown, stored: unknown): boolean {
  if (typeof provided !== 'string' || typeof stored !== 'string') return false;
  if (provided.length !== stored.length) return false;
  let diff = 0;
  for (let i = 0; i < stored.length; i++) {
    diff |= provided.charCodeAt(i) ^ stored.charCodeAt(i);
  }
  return diff === 0;
}

function validateTexto(texto: unknown): string | null {
  if (typeof texto !== 'string') return null;
  const trimmed = texto.trim();
  if (!trimmed || trimmed.length > 500) return null;
  return trimmed;
}

async function authorizeComment(commentId: string, editToken: unknown) {
  const snap = await getAdminDb().collection('comentarios').doc(String(commentId)).get();
  if (!snap.exists) {
    return { error: jsonResponse({ error: 'Comentario no encontrado' }, 404) };
  }
  const data = snap.data();
  if (!tokenOk(editToken, data?.editToken)) {
    return { error: jsonResponse({ error: 'No puedes editar este comentario desde este dispositivo.' }, 403) };
  }
  return { ref: snap.ref, data };
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { commentId, editToken, texto } = body ?? {};

    if (!commentId) return jsonResponse({ error: 'commentId requerido' }, 400);
    const safeTexto = validateTexto(texto);
    if (!safeTexto) return jsonResponse({ error: 'Comentario inválido (máx. 500 caracteres).' }, 400);

    const auth = await authorizeComment(commentId, editToken);
    if ('error' in auth && auth.error) return auth.error;

    await auth.ref!.update({
      texto:     safeTexto,
      editadoEn: FieldValue.serverTimestamp(),
    });

    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error('[comentarios PATCH]', err);
    return jsonResponse({ error: 'Error interno del servidor' }, 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { commentId, editToken } = body ?? {};

    if (!commentId) return jsonResponse({ error: 'commentId requerido' }, 400);

    const auth = await authorizeComment(commentId, editToken);
    if ('error' in auth && auth.error) return auth.error;

    await auth.ref!.delete();
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error('[comentarios DELETE]', err);
    return jsonResponse({ error: 'Error interno del servidor' }, 500);
  }
}
