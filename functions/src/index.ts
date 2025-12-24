/**
 * Cloud Functions for Doctor On Call
 * 
 * Handles admin actions that require elevated privileges.
 * Follows Single Responsibility Principle - each function handles one admin action.
 */

import * as functions from 'firebase-functions/v2'
import * as admin from 'firebase-admin'
import { logger } from 'firebase-functions'

// Initialize Firebase Admin SDK
admin.initializeApp()

const db = admin.firestore()

/**
 * Approve Doctor Function
 * 
 * Callable function to approve a doctor account.
 * Only admins can call this function.
 * 
 * @param data - { userId: string, approved: boolean }
 * @param context - Callable context with auth info
 */
export const approveDoctor = functions.https.onCall(
  {
    enforceAppCheck: false, // Set to true in production if App Check is enabled
  },
  async (request) => {
    const { userId, approved } = request.data

    // Validate input
    if (!userId || typeof userId !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'userId is required and must be a string'
      )
    }

    if (typeof approved !== 'boolean') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'approved must be a boolean'
      )
    }

    // Verify caller is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      )
    }

    const callerUid = request.auth.uid

    // Verify caller is admin
    const callerDoc = await db.collection('users').doc(callerUid).get()
    if (!callerDoc.exists) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Caller user document not found'
      )
    }

    const callerData = callerDoc.data()
    if (callerData?.role !== 'admin') {
      logger.warn(`Non-admin user ${callerUid} attempted to approve doctor`)
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can approve doctors'
      )
    }

    // Verify target user exists and is a doctor
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User not found'
      )
    }

    const userData = userDoc.data()
    if (userData?.role !== 'doctor') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Only doctors can be approved'
      )
    }

    // Update user document
    await db.collection('users').doc(userId).update({
      approved,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    logger.info(`Admin ${callerUid} ${approved ? 'approved' : 'rejected'} doctor ${userId}`)

    return {
      success: true,
      userId,
      approved,
    }
  }
)

/**
 * Ban User Function
 * 
 * Callable function to ban a user account.
 * Only admins can call this function.
 * 
 * @param data - { userId: string, banned: boolean }
 * @param context - Callable context with auth info
 */
export const banUser = functions.https.onCall(
  {
    enforceAppCheck: false, // Set to true in production if App Check is enabled
  },
  async (request) => {
    const { userId, banned } = request.data

    // Validate input
    if (!userId || typeof userId !== 'string') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'userId is required and must be a string'
      )
    }

    if (typeof banned !== 'boolean') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'banned must be a boolean'
      )
    }

    // Verify caller is authenticated
    if (!request.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      )
    }

    const callerUid = request.auth.uid

    // Verify caller is admin
    const callerDoc = await db.collection('users').doc(callerUid).get()
    if (!callerDoc.exists) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Caller user document not found'
      )
    }

    const callerData = callerDoc.data()
    if (callerData?.role !== 'admin') {
      logger.warn(`Non-admin user ${callerUid} attempted to ban user`)
      throw new functions.https.HttpsError(
        'permission-denied',
        'Only admins can ban users'
      )
    }

    // Prevent banning self
    if (userId === callerUid) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Cannot ban yourself'
      )
    }

    // Verify target user exists
    const userDoc = await db.collection('users').doc(userId).get()
    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        'User not found'
      )
    }

    // Update user document with banned status
    await db.collection('users').doc(userId).update({
      banned,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    logger.info(`Admin ${callerUid} ${banned ? 'banned' : 'unbanned'} user ${userId}`)

    return {
      success: true,
      userId,
      banned,
    }
  }
)

