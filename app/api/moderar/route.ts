import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { CATEGORIES } from '@/lib/categories';

const VALID_CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

// Force dynamic so Next.js never tries to statically render this route
export const dynamic = 'force-dynamic';

// ---------- helpers ----------

function pinOk(pin: unknown): boolean {
  const secret = process.env.MODERATOR_PIN;
  if (!secret || typeof pin !== 'string') return false;
  // Constant-time comparison to prevent timing attacks
  if (pin.length !== secret.length) return false;
  let diff = 0;
  for (let i = 0; i < secret.length; i++) {
    diff |= pin.charCodeAt(i) ^ secret.charCodeAt(i);
  }
  return diff === 0;
}

const UNAUTHORIZED = NextResponse.json({ error: 'PIN incorrecto' }, { status: 401 });
const BAD = (msg: string) => NextResponse.json({ error: msg }, { status: 400 });

// ---------- DELETE — borrar tarjeta ----------

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, cardId } = body ?? {};

    if (!pinOk(pin)) return UNAUTHORIZED;
    if (!cardId)      return BAD('cardId requerido');

    await getAdminDb().collection('tarjetas').doc(String(cardId)).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[moderar DELETE]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ---------- PATCH — editar tarjeta ----------

const EDITABLE = ['titulo', 'descripcion', 'autor', 'categoria', 'imagenUrl'] as const;

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { pin, cardId, updates } = body ?? {};

    if (!pinOk(pin))                             return UNAUTHORIZED;
    if (!cardId)                                  return BAD('cardId requerido');
    if (!updates || typeof updates !== 'object')  return BAD('updates requerido');

    const safe: Record<string, string | null> = {};
    for (const field of EDITABLE) {
      if (field === 'imagenUrl') {
        if (updates.imagenUrl === null) safe.imagenUrl = null;
        else if (typeof updates.imagenUrl === 'string' && updates.imagenUrl.startsWith('https://')) {
          safe.imagenUrl = updates.imagenUrl;
        }
        continue;
      }
      if (typeof updates[field] === 'string') safe[field] = updates[field];
    }
    if (Object.keys(safe).length === 0) return BAD('Sin campos válidos para actualizar');
    if (safe.categoria && !VALID_CATEGORY_IDS.has(safe.categoria)) {
      return BAD('Categoría no válida');
    }

    await getAdminDb().collection('tarjetas').doc(String(cardId)).update(safe);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[moderar PATCH]', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
