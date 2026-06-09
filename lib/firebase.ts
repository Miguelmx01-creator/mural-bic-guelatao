import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { firebasePublicConfig } from './public-config';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY            ?? firebasePublicConfig.apiKey,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN        ?? firebasePublicConfig.authDomain,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID         ?? firebasePublicConfig.projectId,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET     ?? firebasePublicConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? firebasePublicConfig.messagingSenderId,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID             ?? firebasePublicConfig.appId,
};

/** Firebase client config is always available (env or public-config fallback). */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
