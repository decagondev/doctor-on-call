/**
 * Firebase Service Abstraction
 * 
 * Provides an abstraction layer over Firebase services following
 * Dependency Inversion Principle. This allows for:
 * - Easy testing with mock implementations
 * - Swapping Firebase implementations if needed
 * - Centralized Firebase service access
 */

import { auth, db, storage } from '@/lib/firebase'
import type { Auth } from 'firebase/auth'
import type { Firestore as FirestoreType } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'

/**
 * Firebase Service Interface
 * Defines the contract for Firebase service access
 * Following Interface Segregation Principle - focused interface
 */
export interface IFirebaseService {
  getAuth(): Auth
  getFirestore(): FirestoreType
  getStorage(): FirebaseStorage
}

/**
 * Firebase Service Implementation
 * Concrete implementation of IFirebaseService
 * Provides access to initialized Firebase services
 */
class FirebaseService implements IFirebaseService {
  /**
   * Get Firebase Auth instance
   * @returns Initialized Auth instance
   */
  getAuth(): Auth {
    return auth
  }

  /**
   * Get Cloud Firestore instance
   * @returns Initialized Firestore instance
   */
  getFirestore(): FirestoreType {
    return db
  }

  /**
   * Get Firebase Storage instance
   * @returns Initialized Storage instance
   */
  getStorage(): FirebaseStorage {
    return storage
  }
}

/**
 * Singleton instance of FirebaseService
 * Export for dependency injection into feature services
 */
export const firebaseService = new FirebaseService()

