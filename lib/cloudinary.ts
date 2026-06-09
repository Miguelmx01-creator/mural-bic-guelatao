import { cloudinaryPublicConfig } from './public-config';

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
  formData.append('quality', 'auto:good');
  formData.append('fetch_format', 'auto');

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? 'Error al subir la imagen a Cloudinary');
  }

  const data = await res.json();
  return data.secure_url as string;
}
