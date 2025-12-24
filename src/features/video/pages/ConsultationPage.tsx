/**
 * Consultation Page
 * 
 * Page for joining video consultations via Jitsi Meet.
 * Follows Single Responsibility Principle - only handles consultation page logic.
 * Uses ProtectedRoute for authentication.
 */

import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute'
import { JitsiRoom } from '../components/JitsiRoom'
import { useVideoConsultation } from '../hooks/useVideoConsultation'
import { formatTimeUntilStart } from '../utils/timeValidation'
import { SEO } from '@/components/seo/SEO'

/**
 * Consultation Page Component
 * 
 * Displays video consultation interface with time validation.
 * Only allows joining within ±5 minutes of appointment start time.
 */
function ConsultationPageContent(): JSX.Element {
  const navigate = useNavigate()
  const { appointment, loading, error, timeValidation, userInfo, canJoin } =
    useVideoConsultation()

  /**
   * Handle leaving consultation
   */
  const handleLeave = (): void => {
    navigate('/dashboard')
  }

  /**
   * Handle error in Jitsi room
   */
  const handleError = (err: Error): void => {
    console.error('Jitsi error:', err)
    // Could show toast notification here
  }

  // Loading state
  if (loading) {
    return (
      <>
        <SEO
          title="Loading Consultation | Doctor On Call"
          description="Loading video consultation..."
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground">Loading consultation...</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (error || !appointment || !userInfo) {
    return (
      <>
        <SEO
          title="Consultation Error | Doctor On Call"
          description="Unable to load consultation"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Consultation Unavailable</h1>
            <p className="text-destructive">{error?.message || 'Failed to load consultation'}</p>
            <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
          </div>
        </div>
      </>
    )
  }

  // Time validation failed
  if (!canJoin && timeValidation) {
    return (
      <>
        <SEO
          title="Consultation Not Available | Doctor On Call"
          description="Consultation is not available at this time"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Consultation Not Available</h1>
            <p className="text-muted-foreground">{timeValidation.reason}</p>
            {timeValidation.timeUntilStart !== undefined &&
              timeValidation.timeUntilStart > 0 && (
                <p className="text-sm text-muted-foreground">
                  Time until start:{' '}
                  {formatTimeUntilStart(timeValidation.timeUntilStart)}
                </p>
              )}
            <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
          </div>
        </div>
      </>
    )
  }

  // Show Jitsi room
  return (
    <>
      <SEO
        title="Video Consultation | Doctor On Call"
        description="Join your video consultation"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Video Consultation</h1>
            <Button variant="outline" onClick={handleLeave}>
              Leave Consultation
            </Button>
          </div>
          <div className="border rounded-lg overflow-hidden">
            <JitsiRoom
              roomName={appointment.roomName}
              userInfo={userInfo}
              onLeave={handleLeave}
              onError={handleError}
            />
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * Consultation Page with Protected Route
 * Requires authentication to access
 */
export function ConsultationPage(): JSX.Element {
  return (
    <ProtectedRoute>
      <ConsultationPageContent />
    </ProtectedRoute>
  )
}

