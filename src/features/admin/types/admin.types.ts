/**
 * Admin Types
 * 
 * Type definitions for admin feature following TypeScript strict mode.
 */

import type { UserRole } from '@/features/auth/types/auth.types'

/**
 * User list item for admin view
 * Combines user document data with public doctor profile if applicable
 */
export interface AdminUserListItem {
  uid: string
  email: string
  name: string
  role: UserRole
  approved: boolean
  createdAt: Date
  doctorProfile?: {
    specialty: string
    bio: string
    photoURL?: string
  }
}

/**
 * User approval action input
 */
export interface ApproveUserInput {
  userId: string
  approved: boolean
}

