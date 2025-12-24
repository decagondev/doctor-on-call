/**
 * Jitsi Room Component
 * 
 * Component for embedding Jitsi Meet video consultations.
 * Follows Single Responsibility Principle - only handles Jitsi integration.
 * Uses Dependency Inversion Principle - depends on window.JitsiMeetExternalAPI abstraction.
 */

import { useEffect, useRef, useState } from 'react'
import type { JitsiRoomProps } from '../types/video.types'
import type { JitsiMeetExternalAPI, JitsiMeetExternalAPIConstructor } from '../types/video.types'

/**
 * Global window interface extension for Jitsi Meet
 */
declare global {
  interface Window {
    JitsiMeetExternalAPI?: JitsiMeetExternalAPIConstructor
  }
}

/**
 * Jitsi Room Component
 * 
 * Loads Jitsi Meet external API dynamically and initializes video room.
 * Properly disposes API on unmount to prevent memory leaks.
 * 
 * Pseudocode:
 * 1. Create container ref for Jitsi iframe
 * 2. Check if JitsiMeetExternalAPI is already loaded
 * 3. If not, dynamically load external_api.js script
 * 4. Initialize JitsiMeetExternalAPI with room configuration
 * 5. Set up event listeners (readyToClose, videoConferenceLeft)
 * 6. Clean up API on unmount
 */
export function JitsiRoom({
  roomName,
  userInfo,
  onLeave,
  onError,
}: JitsiRoomProps): React.JSX.Element {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<JitsiMeetExternalAPI | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!jitsiContainerRef.current) {
      return
    }

    let scriptElement: HTMLScriptElement | null = null

    /**
     * Initialize Jitsi Meet API
     * Called after script is loaded or if already available
     */
    const initializeJitsi = (): void => {
      if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) {
        const err = new Error('Jitsi Meet API not available')
        setError(err)
        onError?.(err)
        setLoading(false)
        return
      }

      try {
        const api = new window.JitsiMeetExternalAPI!('meet.jit.si', {
          roomName,
          parentNode: jitsiContainerRef.current,
          width: '100%',
          height: '100%',
          userInfo: {
            displayName: userInfo.displayName,
            email: userInfo.email,
          },
          interfaceConfigOverwrite: {
            TOOLBAR_BUTTONS: [
              'microphone',
              'camera',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'chat',
              'settings',
              'videoquality',
              'filmstrip',
              'feedback',
              'stats',
              'shortcuts',
            ],
            SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile'],
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_BRAND_WATERMARK: false,
            BRAND_WATERMARK_LINK: '',
            SHOW_POWERED_BY: false,
            DISPLAY_WELCOME_PAGE: false,
            DISPLAY_WELCOME_PAGE_CONTENT: false,
            DISPLAY_WELCOME_FOOTER: false,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            enableClosePage: false,
          },
        })

        apiRef.current = api

        // Event listeners
        api.addEventListener('readyToClose', () => {
          api.dispose()
          apiRef.current = null
          onLeave?.()
        })

        api.addEventListener('videoConferenceLeft', () => {
          api.dispose()
          apiRef.current = null
          onLeave?.()
        })

        api.addEventListener('participantLeft', () => {
          // Optional: Handle participant leaving
        })

        api.addEventListener('participantJoined', () => {
          // Optional: Handle participant joining
        })

        setLoading(false)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize Jitsi Meet')
        setError(error)
        onError?.(error)
        setLoading(false)
      }
    }

    // Check if JitsiMeetExternalAPI is already loaded
    if (window.JitsiMeetExternalAPI) {
      initializeJitsi()
    } else {
      // Dynamically load external_api.js script
      scriptElement = document.createElement('script')
      scriptElement.src = 'https://meet.jit.si/external_api.js'
      scriptElement.async = true
      scriptElement.type = 'text/javascript'

      scriptElement.onload = () => {
        initializeJitsi()
      }

      scriptElement.onerror = () => {
        const err = new Error('Failed to load Jitsi Meet external API')
        setError(err)
        onError?.(err)
        setLoading(false)
      }

      document.head.appendChild(scriptElement)
    }

    // Cleanup function
    return () => {
      // Dispose Jitsi API
      if (apiRef.current) {
        try {
          apiRef.current.dispose()
        } catch (err) {
          // Ignore disposal errors
          console.warn('Error disposing Jitsi API:', err)
        }
        apiRef.current = null
      }

      // Remove script element if it was added
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
      }
    }
  }, [roomName, userInfo.displayName, userInfo.email, onLeave, onError])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading video consultation...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px]">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">Failed to load video consultation</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  // Jitsi container
  return (
    <div
      ref={jitsiContainerRef}
      className="w-full h-full min-h-[600px] rounded-lg overflow-hidden"
      style={{ minHeight: '600px' }}
    />
  )
}

