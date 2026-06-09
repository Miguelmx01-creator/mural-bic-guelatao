import { cloudinaryPublicConfig } from './public-config';
import { compressImageForUpload } from './image-utils';

/**
 * Unsigned upload to Cloudinary.
 * Uses an unsigned preset configured in the Cloudinary dashboard.
 * Safe to call from the browser — no API secret is needed.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME    ?? cloudinaryPublicConfig.cloudName;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? cloudinaryPublicConfig.uploadPreset;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary no está configurado: revisa las variables de entorno.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'mural-bic');

  let res: Response;
  try {
    res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: formData }
    );
  } catch {
    throw new Error(
      'Sin conexión al subir la imagen. Revisa tu internet, acércate al WiFi e intenta de nuevo.'
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Error al subir la imagen a Cloudinary');
  }

  const data = await res.json();
  return data.secure_url as string;
}

async function uploadWithRetry(file: File, retries = 2): Promise<string> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await uploadToCloudinary(file);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Error al subir la imagen');
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 1200 * (attempt + 1)));
      }
    }
  }
  throw lastError ?? new Error('Error al subir la imagen');
}

/** Sube imágenes una por una (más estable en celular con mala señal). */
export async function uploadImagesToCloudinary(
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<string[]> {
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i + 1, files.length);
    const compressed = await compressImageForUpload(files[i]);
    urls.push(await uploadWithRetry(compressed));
  }
  return urls;
}
