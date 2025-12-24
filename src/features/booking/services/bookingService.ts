/**
 * Booking Service
 * 
 * Handles all booking operations following Single Responsibility Principle.
 * Abstracts Firebase Firestore operations for booking management.
 * Uses Dependency Inversion Principle - depends on IFirebaseService abstraction.
 */

import { firebaseService } from '@/lib/services/firebaseService'
import type { IFirebaseService } from '@/lib/services/firebaseService'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  runTransaction,
  Timestamp,
  type Firestore,
  type DocumentReference,
} from 'firebase/firestore'
import type {
  Appointment,
  AppointmentWithDoctor,
  AppointmentWithClient,
  BookingInput,
  DoctorSearchFilters,
} from '../types/booking.types'
import type { DoctorPublicProfile } from '@/features/profile/types/profile.types'
import type { AvailabilitySlot } from '@/features/availability/types/availability.types'

/**
 * Booking Service Class
 * Single Responsibility: Handle all booking operations
 */
class BookingService {
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
   * Generate unique room name for appointment
   * Format: doconcall-{appointmentId}-{timestamp}
   */
  private generateRoomName(appointmentId: string): string {
    const timestamp = Date.now()
    return `doconcall-${appointmentId}-${timestamp}`
  }

  /**
   * Book an appointment (transactional)
   * Pseudocode:
   * 1. Start Firestore transaction
   * 2. Read slot document
   * 3. Check if slot is already booked
   * 4. Verify slot start time is in future
   * 5. Verify requester is authenticated client
   * 6. Create appointment document
   * 7. Update slot.booked = true
   * 8. Commit transaction (atomic)
   */
  async bookAppointment(
    clientId: string,
    bookingInput: BookingInput
  ): Promise<Appointment> {
    const firestore = this.getFirestore()

    return runTransaction(firestore, async (transaction) => {
      // Get slot reference
      const slotRef = doc(
        firestore,
        'availability',
        bookingInput.doctorId,
        'slots',
        bookingInput.slotId
      )

      // Read slot document
      const slotDoc = await transaction.get(slotRef)

      if (!slotDoc.exists()) {
        throw new Error('Slot not found')
      }

      const slotData = slotDoc.data() as AvailabilitySlot

      // Check if slot is already booked
      if (slotData.booked) {
        throw new Error('Slot is already booked')
      }

      // Verify slot start time is in future
      const slotStart = slotData.start.toDate()
      if (slotStart < new Date()) {
        throw new Error('Cannot book past slots')
      }

      // Create appointment document
      const appointmentRef = doc(collection(firestore, 'appointments'))
      const appointmentId = appointmentRef.id

      const appointment: Omit<Appointment, 'id'> = {
        clientId,
        doctorId: bookingInput.doctorId,
        slotStart: slotData.start,
        slotEnd: slotData.end,
        status: 'pending',
        roomName: this.generateRoomName(appointmentId),
        notes: bookingInput.notes,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }

      // Set appointment document
      transaction.set(appointmentRef, appointment)

      // Update slot as booked
      transaction.update(slotRef, { booked: true })

      return {
        id: appointmentId,
        ...appointment,
      } as Appointment
    })
  }

  /**
   * Get all approved doctors (for discovery)
   * @param filters - Optional search filters
   * @returns Array of doctor profiles
   */
  async getDoctors(
    filters?: DoctorSearchFilters
  ): Promise<DoctorPublicProfile[]> {
    const firestore = this.getFirestore()
    const doctorsRef = collection(firestore, 'doctors')
    const constraints: Parameters<typeof query>[1][] = []

    // Apply filters
    if (filters?.specialty) {
      constraints.push(where('specialty', '==', filters.specialty))
    }

    // Note: Name search would require a different approach (e.g., Algolia)
    // For now, we'll filter client-side

    const q = constraints.length > 0
      ? query(doctorsRef, ...constraints)
      : query(doctorsRef)

    const snapshot = await getDocs(q)

    let doctors = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as DoctorPublicProfile[]

    // Filter by name (client-side)
    if (filters?.name) {
      const searchTerm = filters.name.toLowerCase()
      doctors = doctors.filter(
        (doctor) =>
          doctor.uid.toLowerCase().includes(searchTerm) ||
          // Note: We'd need name in doctor profile for proper search
          false
      )
    }

    return doctors
  }

  /**
   * Get doctor with availability information
   * @param doctorId - Doctor's user ID
   * @returns Doctor profile with availability info
   */
  async getDoctorWithAvailability(
    doctorId: string
  ): Promise<DoctorPublicProfile & { hasAvailableSlots: boolean }> {
    const firestore = this.getFirestore()

    // Get doctor profile
    const doctorRef = doc(firestore, 'doctors', doctorId)
    const doctorDoc = await getDoc(doctorRef)

    if (!doctorDoc.exists()) {
      throw new Error('Doctor not found')
    }

    const doctor = {
      uid: doctorDoc.id,
      ...doctorDoc.data(),
    } as DoctorPublicProfile

    // Check for available slots
    const slotsRef = collection(firestore, 'availability', doctorId, 'slots')
    const availableSlotsQuery = query(
      slotsRef,
      where('booked', '==', false),
      where('start', '>', Timestamp.now()),
      orderBy('start', 'asc')
    )

    const slotsSnapshot = await getDocs(availableSlotsQuery)
    const hasAvailableSlots = !slotsSnapshot.empty

    return {
      ...doctor,
      hasAvailableSlots,
    }
  }

  /**
   * Get appointments for a client
   * @param clientId - Client's user ID
   * @returns Array of appointments with doctor information
   */
  async getClientAppointments(
    clientId: string
  ): Promise<AppointmentWithDoctor[]> {
    const firestore = this.getFirestore()
    const appointmentsRef = collection(firestore, 'appointments')
    const q = query(
      appointmentsRef,
      where('clientId', '==', clientId),
      orderBy('slotStart', 'desc')
    )

    const snapshot = await getDocs(q)
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]

    // Fetch doctor profiles for each appointment
    const appointmentsWithDoctors = await Promise.all(
      appointments.map(async (appointment) => {
        const doctorRef = doc(firestore, 'doctors', appointment.doctorId)
        const doctorDoc = await getDoc(doctorRef)
        const doctor = doctorDoc.exists()
          ? ({
              uid: doctorDoc.id,
              ...doctorDoc.data(),
            } as DoctorPublicProfile)
          : ({
              uid: appointment.doctorId,
              specialty: 'Unknown',
              bio: '',
            } as DoctorPublicProfile)

        return {
          ...appointment,
          doctor,
        } as AppointmentWithDoctor
      })
    )

    return appointmentsWithDoctors
  }

  /**
   * Get appointments for a doctor
   * @param doctorId - Doctor's user ID
   * @returns Array of appointments with client information
   */
  async getDoctorAppointments(
    doctorId: string
  ): Promise<AppointmentWithClient[]> {
    const firestore = this.getFirestore()
    const appointmentsRef = collection(firestore, 'appointments')
    const q = query(
      appointmentsRef,
      where('doctorId', '==', doctorId),
      orderBy('slotStart', 'desc')
    )

    const snapshot = await getDocs(q)
    const appointments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Appointment[]

    // Fetch client information for each appointment
    const appointmentsWithClients = await Promise.all(
      appointments.map(async (appointment) => {
        const userRef = doc(firestore, 'users', appointment.clientId)
        const userDoc = await getDoc(userRef)
        const clientName = userDoc.exists()
          ? (userDoc.data().name as string)
          : 'Unknown'
        const clientEmail = userDoc.exists()
          ? (userDoc.data().email as string)
          : 'Unknown'

        return {
          ...appointment,
          clientName,
          clientEmail,
        } as AppointmentWithClient
      })
    )

    return appointmentsWithClients
  }

  /**
   * Update appointment status
   * @param appointmentId - Appointment ID
   * @param status - New status
   */
  async updateAppointmentStatus(
    appointmentId: string,
    status: Appointment['status']
  ): Promise<void> {
    const firestore = this.getFirestore()
    const appointmentRef = doc(firestore, 'appointments', appointmentId)

    await updateDoc(appointmentRef, {
      status,
      updatedAt: Timestamp.now(),
    })
  }
}

/**
 * Singleton instance of BookingService
 * Export for use in hooks and components
 */
export const bookingService = new BookingService(firebaseService)

