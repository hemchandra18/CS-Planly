/* ═══════════════════════════════════════════════════════
   CS-Planly — Firebase Client
   ═══════════════════════════════════════════════════════ */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD-yHYMpqsrvQ2ctogP5uvOli4sU0EDRnA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "planly-464e6.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "planly-464e6",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "planly-464e6.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "114307574248",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:114307574248:web:b1f49de8e53273526f1c5d",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-LFNW116NSF",
};

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
