import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  getDocs,
  limit,
  query
} from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain?: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const STORAGE_KEY = 'operix_firebase_config';

/**
 * Retrieve current Firebase configuration from localStorage or Vite environment variables.
 */
export function getFirebaseConfig(): FirebaseConfig | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.apiKey && parsed.projectId) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read Firebase config from localStorage', err);
  }

  // Vite environment fallback
  const metaEnv = (import.meta as any).env || {};
  const envKey = metaEnv.VITE_FIREBASE_API_KEY;
  const envProjectId = metaEnv.VITE_FIREBASE_PROJECT_ID;
  const envAppId = metaEnv.VITE_FIREBASE_APP_ID;

  if (envKey && envProjectId) {
    return {
      apiKey: envKey,
      authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || `${envProjectId}.firebaseapp.com`,
      projectId: envProjectId,
      storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
      messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: envAppId || ''
    };
  }

  return null;
}

/**
 * Check if valid Firebase credentials are provided.
 */
export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config && config.apiKey && config.projectId);
}

let appInstance: any = null;
let dbInstance: any = null;

/**
 * Get or initialize the Firebase App singleton.
 */
export function getFirebaseApp(): any {
  const config = getFirebaseConfig();
  if (!config) return null;

  try {
    if (getApps().length > 0) {
      appInstance = getApp();
    } else {
      appInstance = initializeApp(config);
    }
    return appInstance;
  } catch (err) {
    console.warn('Failed to initialize Firebase App:', err);
    return null;
  }
}

/**
 * Get or initialize the Cloud Firestore instance with persistent offline caching.
 */
export function getFirestoreDb(): any {
  const app = getFirebaseApp();
  if (!app) return null;

  if (dbInstance) return dbInstance;

  try {
    // Enable persistent local cache with multi-tab support
    dbInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
      })
    });
  } catch {
    // Fallback if already initialized
    try {
      dbInstance = getFirestore(app);
    } catch (err) {
      console.warn('Could not initialize Firestore instance:', err);
      return null;
    }
  }

  return dbInstance;
}

/**
 * Save new Firebase credentials and reinitialize.
 */
export function saveFirebaseConfig(config: FirebaseConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  appInstance = null;
  dbInstance = null;
}

/**
 * Clear saved credentials.
 */
export function clearFirebaseConfig(): void {
  localStorage.removeItem(STORAGE_KEY);
  appInstance = null;
  dbInstance = null;
}

/**
 * Test whether the current Firestore credentials are functional and reachable.
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const db = getFirestoreDb();
    if (!db) {
      return { success: false, message: 'Firebase configuration is incomplete or missing.' };
    }

    // Attempt a light read to verify credentials
    const q = query(collection(db, 'operix_products'), limit(1));
    await getDocs(q);
    return { success: true, message: 'Successfully connected to Cloud Firestore!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Could not connect to Firebase Firestore.' };
  }
}
