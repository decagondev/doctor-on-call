/**
 * Authentication Types
 * 
 * Type definitions for authentication feature following TypeScript strict mode.
 * Uses type unions for enums (no const enums) and explicit interfaces.
 */

import type { User as FirebaseUser } from 'firebase/auth'

/**
 * User role types
 * Following Open-Closed Principle - can extend with new roles without modifying existing code
 */
export type UserRole = 'client' | 'doctor' | 'admin'

/**
 * User document structure in Firestore
 * Stored in `users/{uid}` collection
 */
export interface UserDocument {
  uid: string
  email: string
  name: string
  role: UserRole
  approved: boolean // Only relevant for doctors
  createdAt: Date
  updatedAt?: Date
}

/**
 * User type combining Firebase Auth user with Firestore user data
 * Used throughout the application
 */
export interface User extends Omit<UserDocument, 'createdAt' | 'updatedAt'> {
  firebaseUser: FirebaseUser
  createdAt: Date
  updatedAt?: Date
}

/**
 * Sign up input data
 * Used for email/password signup
 */
export interface SignUpInput {
  email: string
  password: string
  name: string
  role: UserRole
}

/**
 * Sign in input data
 * Used for email/password signin
 */
export interface SignInInput {
  email: string
  password: string
}

/**
 * Auth state interface
 * Returned by useAuth hook following Interface Segregation Principle
 */
export interface AuthState {
  user: User | null
  loading: boolean
  error: Error | null
}

/**
 * Auth context value interface
 * Minimal interface for auth context consumers
 */
export interface AuthContextValue extends AuthState {
  signUp: (input: SignUpInput) => Promise<User>
  signIn: (input: SignInInput) => Promise<User>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<User>
}

