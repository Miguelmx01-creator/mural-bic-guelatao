import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let _db: Firestore | null = null;

/**
 * Lazy singleton — only initializes when first called at runtime.
 * This avoids crashing during Next.js build (when env vars aren't set).
 */
export function getAdminDb(): Firestore {
  if (_db) return _db;

  const app: App =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId:   process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // Vercel stores multiline env vars as literal \n — restore real newlines
            privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });

  _db = getFirestore(app);
  return _db;
}
