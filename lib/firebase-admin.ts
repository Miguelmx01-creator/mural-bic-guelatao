import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getFirebaseAdminCredentials } from './server-config';

let _db: Firestore | null = null;

/**
 * Lazy singleton — only initializes when first called at runtime.
 * This avoids crashing during Next.js build (when env vars aren't set).
 */
export function getAdminDb(): Firestore {
  if (_db) return _db;

  const creds = getFirebaseAdminCredentials();
  const app: App =
    getApps().length > 0
      ? getApps()[0]
      : initializeApp({
          credential: cert({
            projectId:   creds.projectId,
            clientEmail: creds.clientEmail,
            privateKey:  creds.privateKey,
          }),
        });

  _db = getFirestore(app);
  return _db;
}
