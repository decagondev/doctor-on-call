/**
 * Profile Service
 * 
 * Handles all profile operations following Single Responsibility Principle.
 * Abstracts Firebase Firestore and Storage operations for profile management.
 * Uses Dependency Inversion Principle - depends on IFirebaseService abstraction.
 */

import { firebaseService } from '@/lib/services/firebaseService'
import type { IFirebaseService } from '@/lib/services/firebaseService'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  type FirebaseStorage,
} from 'firebase/storage'
import type {
  ClientProfile,
  DoctorProfile,
  DoctorPublicProfile,
  ClientProfileUpdate,
  DoctorProfileUpdate,
  PhotoUploadResult,
} from '../types/profile.types'

/**
 * Profile Service Class
 * Single Responsibility: Handle all profile operations
 */
class ProfileService {
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
   * Get Storage instance
   * Private helper method
   */
  private getStorage(): FirebaseStorage {
    return this.firebase.getStorage()
  }

  /**
   * Upload photo to Firebase Storage
   * Returns download URL and storage path
   */
  async uploadPhoto(
    userId: string,
    file: File
  ): Promise<PhotoUploadResult> {
    const storage = this.getStorage()
    
    // Generate unique filename: profiles/{userId}/{timestamp}-{filename}
    const timestamp = Date.now()
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `profiles/${userId}/${timestamp}-${filename}`
    const storageRef = ref(storage, storagePath)

    // Upload file
    await uploadBytes(storageRef, file, {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000', // 1 year cache
    })

    // Get download URL
    const photoURL = await getDownloadURL(storageRef)

    return {
      photoURL,
      path: storagePath,
    }
  }

  /**
   * Get client profile
   * Reads from users collection
   */
  async getClientProfile(userId: string): Promise<ClientProfile | null> {
    const firestore = this.getFirestore()
    const userRef = doc(firestore, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return null
    }

    const data = userSnap.data()
    
    // Verify it's a client
    if (data.role !== 'client') {
      return null
    }

    return {
      uid: userId,
      email: data.email,
      name: data.name,
      photoURL: data.photoURL,
      role: 'client',
      updatedAt: data.updatedAt?.toDate(),
    }
  }

  /**
   * Update client profile
   * Updates users collection document
   */
  async updateClientProfile(
    userId: string,
    update: ClientProfileUpdate
  ): Promise<void> {
    const firestore = this.getFirestore()
    const userRef = doc(firestore, 'users', userId)

    await updateDoc(userRef, {
      name: update.name,
      photoURL: update.photoURL || null,
      updatedAt: serverTimestamp(),
    })
  }

  /**
   * Get doctor profile
   * Combines users and doctors collections
   */
  async getDoctorProfile(userId: string): Promise<DoctorProfile | null> {
    const firestore = this.getFirestore()
    
    // Get user document
    const userRef = doc(firestore, 'users', userId)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return null
    }

    const userData = userSnap.data()
    
    // Verify it's a doctor
    if (userData.role !== 'doctor') {
      return null
    }

    // Get public profile
    const doctorRef = doc(firestore, 'doctors', userId)
    const doctorSnap = await getDoc(doctorRef)

    let publicProfile: DoctorPublicProfile | undefined

    if (doctorSnap.exists()) {
      const doctorData = doctorSnap.data()
      publicProfile = {
        uid: userId,
        specialty: doctorData.specialty,
        bio: doctorData.bio,
        photoURL: doctorData.photoURL,
        rating: doctorData.rating,
        qualifications: doctorData.qualifications,
        updatedAt: doctorData.updatedAt?.toDate(),
      }
    }

    return {
      uid: userId,
      email: userData.email,
      name: userData.name,
      photoURL: userData.photoURL,
      role: 'doctor',
      approved: userData.approved ?? false,
      publicProfile,
    }
  }

  /**
   * Update doctor profile
   * Updates both users and doctors collections
   */
  async updateDoctorProfile(
    userId: string,
    update: DoctorProfileUpdate
  ): Promise<void> {
    const firestore = this.getFirestore()

    // Update user document
    const userRef = doc(firestore, 'users', userId)
    await updateDoc(userRef, {
      name: update.name,
      photoURL: update.photoURL || null,
      updatedAt: serverTimestamp(),
    })

    // Update or create doctor public profile
    const doctorRef = doc(firestore, 'doctors', userId)
    const doctorSnap = await getDoc(doctorRef)

    const doctorData = {
      specialty: update.specialty,
      bio: update.bio,
      photoURL: update.photoURL || null,
      qualifications: update.qualifications || [],
      updatedAt: serverTimestamp(),
    }

    if (doctorSnap.exists()) {
      await updateDoc(doctorRef, doctorData)
    } else {
      await setDoc(doctorRef, {
        ...doctorData,
        rating: 0,
      })
    }
  }
}

/**
 * Singleton instance of ProfileService
 * Export for use throughout the application
 */
export const profileService = new ProfileService(firebaseService)

