'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'studio-4727962049-274a8',
  appId: '1:45946910347:web:1a4932f9ad45ebf433c68e',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA6meHjL9nzLfciwn233-Mc2BH2xepmF1k',
  authDomain: 'studio-4727962049-274a8.firebaseapp.com',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
