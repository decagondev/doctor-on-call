/**
 * Video Types
 * 
 * Type definitions for video consultation feature following TypeScript strict mode.
 * Follows Single Responsibility Principle - only video-related types.
 */

/**
 * Jitsi Meet External API interface
 * Extends the global Window interface to include JitsiMeetExternalAPI
 */
export interface JitsiMeetExternalAPI {
  dispose: () => void
  addEventListener: (event: string, callback: (event: unknown) => void) => void
  removeEventListener: (event: string, callback: (event: unknown) => void) => void
  executeCommand: (command: string, value?: unknown) => void
  on: (event: string, callback: (event: unknown) => void) => void
  off: (event: string, callback: (event: unknown) => void) => void
}

/**
 * Jitsi Meet External API constructor
 */
export interface JitsiMeetExternalAPIConstructor {
  new (domain: string, options: JitsiMeetOptions): JitsiMeetExternalAPI
}

/**
 * Jitsi Meet initialization options
 */
export interface JitsiMeetOptions {
  roomName: string
  parentNode: HTMLElement | null
  width?: string | number
  height?: string | number
  userInfo?: {
    displayName: string
    email: string
  }
  configOverwrite?: Record<string, unknown>
  interfaceConfigOverwrite?: Record<string, unknown>
  onload?: () => void
}

/**
 * JitsiRoom component props
 * Following Interface Segregation Principle - minimal, focused props
 */
export interface JitsiRoomProps {
  roomName: string
  userInfo: {
    displayName: string
    email: string
  }
  onLeave?: () => void
  onError?: (error: Error) => void
}

/**
 * Time validation result
 */
export interface TimeValidationResult {
  canJoin: boolean
  reason?: string
  timeUntilStart?: number // milliseconds
}

