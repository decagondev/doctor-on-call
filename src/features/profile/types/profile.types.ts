/**
 * Profile Types
 * 
 * Type definitions for profile feature following TypeScript strict mode.
 * Separates client and doctor profile types following Single Responsibility Principle.
 */

/**
 * Base profile fields shared by all users
 * Stored in `users/{uid}` collection
 */
export interface BaseProfile {
  uid: string
  email: string
  name: string
  photoURL?: string
  updatedAt?: Date
}

/**
 * Client profile
 * Extends base profile with client-specific fields
 */
export interface ClientProfile extends BaseProfile {
  role: 'client'
}

/**
 * Doctor profile public data
 * Stored in `doctors/{uid}` collection (public)
 */
export interface DoctorPublicProfile {
  uid: string
  specialty: string
  bio: string
  photoURL?: string
  rating?: number
  qualifications?: string[]
  updatedAt?: Date
}

/**
 * Doctor profile private data
 * Combined with user document data
 */
export interface DoctorProfile extends BaseProfile {
  role: 'doctor'
  approved: boolean
  publicProfile?: DoctorPublicProfile
}

/**
 * Profile update input for clients
 */
export interface ClientProfileUpdate {
  name: string
  photoURL?: string
}

/**
 * Profile update input for doctors
 */
export interface DoctorProfileUpdate {
  name: string
  photoURL?: string
  specialty: string
  bio: string
  qualifications?: string[]
}

/**
 * Photo upload result
 */
export interface PhotoUploadResult {
  photoURL: string
  path: string
}

