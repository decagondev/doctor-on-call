/**
 * Firebase Initialization
 * 
 * Initializes Firebase services (Auth, Firestore, Storage) with configuration
 * from environment variables. Follows Dependency Inversion Principle by
 * exporting initialized instances that can be injected into services.
 */

import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

/**
 * Firebase configuration interface
 * All values come from environment variables prefixed with VITE_
 */
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

/**
 * Get Firebase configuration from environment variables
 * Throws error if required variables are missing
 */
function getFirebaseConfig(): FirebaseConfig {
  const config: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }

  // Validate all required config values are present
  const missingKeys = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required Firebase environment variables: ${missingKeys.join(', ')}\n` +
      'Please create a .env.local file with all required Firebase configuration values.'
    )
  }

  return config
}

/**
 * Initialize Firebase App
 * Singleton pattern - only one app instance per application
 */
const firebaseConfig = getFirebaseConfig()
export const app: FirebaseApp = initializeApp(firebaseConfig)

/**
 * Initialize Firebase Auth
 * Exported for use in auth services
 */
export const auth: Auth = getAuth(app)

/**
 * Initialize Cloud Firestore
 * Exported for use in firestore services
 */
export const db: Firestore = getFirestore(app)

/**
 * Initialize Firebase Storage
 * Exported for use in storage services
 */
export const storage: FirebaseStorage = getStorage(app)

