/**
 * Admin Service
 * 
 * Handles all admin operations following Single Responsibility Principle.
 * Abstracts Firebase Firestore operations for admin management.
 * Uses Dependency Inversion Principle - depends on IFirebaseService abstraction.
 */

import { firebaseService } from '@/lib/services/firebaseService'
import type { IFirebaseService } from '@/lib/services/firebaseService'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore'
import type { AdminUserListItem, ApproveUserInput } from '../types/admin.types'

/**
 * Admin Service Class
 * Single Responsibility: Handle all admin operations
 */
class AdminService {
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
   * Get all users for admin view
   * Returns list of users with optional doctor profiles
   */
  async getAllUsers(): Promise<AdminUserListItem[]> {
    const firestore = this.getFirestore()
    
    // Get all users
    const usersRef = collection(firestore, 'users')
    const usersQuery = query(usersRef, orderBy('createdAt', 'desc'))
    const usersSnapshot = await getDocs(usersQuery)

    const users: AdminUserListItem[] = []

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data()
      
      const user: AdminUserListItem = {
        uid: userDoc.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        approved: userData.approved ?? false,
        createdAt: userData.createdAt?.toDate() ?? new Date(),
      }

      // If doctor, get public profile
      if (userData.role === 'doctor') {
        const doctorRef = doc(firestore, 'doctors', userDoc.id)
        const doctorSnap = await getDoc(doctorRef)
        
        if (doctorSnap.exists()) {
          const doctorData = doctorSnap.data()
          user.doctorProfile = {
            specialty: doctorData.specialty,
            bio: doctorData.bio,
            photoURL: doctorData.photoURL,
          }
        }
      }

      users.push(user)
    }

    return users
  }

  /**
   * Approve or reject a doctor
   * Updates the user document's approved field
   * Note: In production, this should call a Cloud Function for security
   */
  async approveUser(input: ApproveUserInput): Promise<void> {
    const firestore = this.getFirestore()
    const userRef = doc(firestore, 'users', input.userId)
    
    // Verify user exists and is a doctor
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      throw new Error('User not found')
    }

    const userData = userSnap.data()
    if (userData.role !== 'doctor') {
      throw new Error('Only doctors can be approved')
    }

    // Update approved status
    await updateDoc(userRef, {
      approved: input.approved,
      updatedAt: serverTimestamp(),
    })
  }

  /**
   * Get pending doctors (doctors awaiting approval)
   */
  async getPendingDoctors(): Promise<AdminUserListItem[]> {
    const allUsers = await this.getAllUsers()
    return allUsers.filter(
      (user) => user.role === 'doctor' && !user.approved
    )
  }
}

/**
 * Singleton instance of AdminService
 * Export for use throughout the application
 */
export const adminService = new AdminService(firebaseService)

