/**
 * Config pública de Firebase y Cloudinary para el mural.
 * Estos valores van al bundle del navegador (no son secretos).
 * Las variables de entorno en Vercel las sobreescriben si existen.
 */
export const firebasePublicConfig = {
  apiKey:            'AIzaSyDKFoqNezYjzTNk_xDXsNnz3xIxLh8',
  authDomain:        'mural-bic.firebaseapp.com',
  projectId:         'mural-bic',
  storageBucket:     'mural-bic.firebasestorage.app',
  messagingSenderId: '177376337542',
  appId:             '1:177376337542:web:b3269ded355b0c1c15786d27',
} as const;

export const cloudinaryPublicConfig = {
  cloudName:    'dmpswvqno',
  uploadPreset: 'mural-bic-preset',
} as const;
