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
  getDoc,
  query,
  orderBy,
  type Firestore,
} from 'firebase/firestore'
import { getFunctions, httpsCallable } from 'firebase/functions'
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
   * Calls Cloud Function for secure admin action
   */
  async approveUser(input: ApproveUserInput): Promise<void> {
    const functions = getFunctions()
    const approveDoctor = httpsCallable<{ userId: string; approved: boolean }, { success: boolean; userId: string; approved: boolean }>(
      functions,
      'approveDoctor'
    )

    try {
      const result = await approveDoctor({
        userId: input.userId,
        approved: input.approved,
      })

      if (!result.data.success) {
        throw new Error('Failed to approve doctor')
      }
    } catch (error) {
      // Handle Firebase Functions errors
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string }
        switch (firebaseError.code) {
          case 'permission-denied':
            throw new Error('You do not have permission to approve doctors')
          case 'not-found':
            throw new Error('User not found')
          case 'invalid-argument':
            throw new Error('Invalid request. Only doctors can be approved.')
          default:
            throw new Error(firebaseError.message || 'Failed to approve doctor')
        }
      }
      throw error
    }
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

