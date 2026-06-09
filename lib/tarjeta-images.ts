export const MAX_IMAGES_PER_CARD = 6;

export function parseImagenUrls(data: {
  imagenUrls?: unknown;
  imagenUrl?: unknown;
}): string[] {
  if (Array.isArray(data.imagenUrls)) {
    return data.imagenUrls
      .filter((u): u is string => typeof u === 'string' && u.startsWith('https://'))
      .slice(0, MAX_IMAGES_PER_CARD);
  }
  if (typeof data.imagenUrl === 'string' && data.imagenUrl.startsWith('https://')) {
    return [data.imagenUrl];
  }
  return [];
}

export function toFirestoreImages(urls: string[]): {
  imagenUrls: string[];
  imagenUrl: string | null;
} {
  const imagenUrls = urls
    .filter((u) => typeof u === 'string' && u.startsWith('https://'))
    .slice(0, MAX_IMAGES_PER_CARD);
  return { imagenUrls, imagenUrl: imagenUrls[0] ?? null };
}
