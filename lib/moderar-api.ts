/**
 * Parsea respuestas de /api/moderar aunque el cuerpo venga vacío (bug en algunos 401).
 */
export async function parseModerarResponse(res: Response): Promise<{ ok?: boolean; error?: string }> {
  const text = await res.text();
  if (!text) {
    if (res.status === 401) return { error: 'PIN incorrecto.' };
    if (res.status >= 500) return { error: 'Error del servidor. Intenta de nuevo en un momento.' };
    return { error: `Error al guardar (código ${res.status}).` };
  }
  try {
    return JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    return { error: 'Respuesta inválida del servidor.' };
  }
}
