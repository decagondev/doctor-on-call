/**
 * Authentication Service
 * 
 * Handles all authentication operations following Single Responsibility Principle.
 * Abstracts Firebase Auth operations and provides clean interface for components.
 * Uses Dependency Inversion Principle - depends on IFirebaseService abstraction.
 */

import { firebaseService } from '@/lib/services/firebaseService'
import type { IFirebaseService } from '@/lib/services/firebaseService'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  type User as FirebaseUser,
  type UserCredential,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'
import type { User, UserDocument, SignUpInput, SignInInput, UserRole } from '../types/auth.types'

/**
 * Authentication Service Class
 * Single Responsibility: Handle all authentication operations
 */
class AuthService {
  private firebase: IFirebaseService

  constructor(firebase: IFirebaseService) {
    this.firebase = firebase
  }

  /**
   * Get Firestore instance
   * Private helper method
   */
  private getFirestore(): Firestore {
    return this.firebase.getFirestore()
  }

  /**
   * Create user document in Firestore
   * Called after successful Firebase Auth signup
   */
  private async createUserDocument(
    firebaseUser: FirebaseUser,
    name: string,
    role: UserRole
  ): Promise<UserDocument> {
    const firestore = this.getFirestore()
    const userDoc: Omit<UserDocument, 'uid'> = {
      email: firebaseUser.email ?? '',
      name,
      role,
      approved: role === 'doctor' ? false : true, // Doctors need approval
      createdAt: new Date(),
    }

    const userRef = doc(firestore, 'users', firebaseUser.uid)
    await setDoc(userRef, {
      ...userDoc,
      createdAt: serverTimestamp(),
    })

    return {
      uid: firebaseUser.uid,
      ...userDoc,
    }
  }

  /**
   * Get user document from Firestore
   * Returns null if document doesn't exist
   */
  private async getUserDocument(uid: string): Promise<UserDocument | null> {
    const firestore = this.getFirestore()
    const userRef = doc(firestore, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return null
    }

    const data = userSnap.data()
    return {
      uid,
      email: data.email,
      name: data.name,
      role: data.role,
      approved: data.approved ?? false,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate(),
    }
  }

  /**
   * Convert Firebase user and document to User type
   */
  private toUser(firebaseUser: FirebaseUser, userDoc: UserDocument): User {
    return {
      ...userDoc,
      firebaseUser,
    }
  }

  /**
   * Sign up with email and password
   * Creates Firebase Auth user and Firestore user document
   */
  async signUp(input: SignUpInput): Promise<User> {
    const auth = this.firebase.getAuth()

    // Create Firebase Auth user
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      input.email,
      input.password
    )

    // Create user document in Firestore
    const userDoc = await this.createUserDocument(
      userCredential.user,
      input.name,
      input.role
    )

    return this.toUser(userCredential.user, userDoc)
  }

  /**
   * Sign in with email and password
   * Retrieves user document from Firestore
   */
  async signIn(input: SignInInput): Promise<User> {
    const auth = this.firebase.getAuth()

    // Sign in with Firebase Auth
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      input.email,
      input.password
    )

    // Get user document from Firestore
    const userDoc = await this.getUserDocument(userCredential.user.uid)

    if (!userDoc) {
      throw new Error('User document not found. Please contact support.')
    }

    return this.toUser(userCredential.user, userDoc)
  }

  /**
   * Sign in with Google OAuth
   * Creates user document if first time sign in
   */
  async signInWithGoogle(): Promise<User> {
    const auth = this.firebase.getAuth()
    const provider = new GoogleAuthProvider()

    // Sign in with popup
    const result = await signInWithPopup(auth, provider)
    const firebaseUser = result.user

    // Check if user document exists
    let userDoc = await this.getUserDocument(firebaseUser.uid)

    // Create user document if first time (default to 'client' role)
    if (!userDoc) {
      userDoc = await this.createUserDocument(
        firebaseUser,
        firebaseUser.displayName ?? 'User',
        'client'
      )
    }

    return this.toUser(firebaseUser, userDoc)
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    const auth = this.firebase.getAuth()
    await firebaseSignOut(auth)
  }

  /**
   * Subscribe to auth state changes
   * Returns unsubscribe function
   */
  onAuthStateChanged(
    callback: (user: User | null) => void
  ): () => void {
    const auth = this.firebase.getAuth()

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null)
        return
      }

      try {
        const userDoc = await this.getUserDocument(firebaseUser.uid)
        if (userDoc) {
          callback(this.toUser(firebaseUser, userDoc))
        } else {
          callback(null)
        }
      } catch (error) {
        console.error('Error loading user document:', error)
        callback(null)
      }
    })
  }
}

/**
 * Singleton instance of AuthService
 * Export for use throughout the application
 */
export const authService = new AuthService(firebaseService)

