'use client'

import { useState } from 'react'
import { MapPin, Calendar, Users, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckInDialog } from './check-in-dialog'
import { ProofUploadModal } from './proof-upload-modal'

interface ActivityDetailsSidebarProps {
  activityId: string
  registrationId?: string | null
  location: string
  startDate: string
  endDate: string
  organizer: string
  contactEmail: string
  contactPhone: string
  currentEnrollment: number
  maxCapacity: number
  isRegistered?: boolean
  onProofSubmitted?: () => void
}

export default function ActivityDetailsSidebar({
  activityId,
  registrationId,
  location,
  startDate,
  endDate,
  organizer,
  contactEmail,
  contactPhone,
  currentEnrollment,
  maxCapacity,
  isRegistered = false,
  onProofSubmitted,
}: ActivityDetailsSidebarProps) {
  const [showCheckInDialog, setShowCheckInDialog] = useState(false)
  const [showProofDialog, setShowProofDialog] = useState(false)

  const isFull = currentEnrollment >= maxCapacity

  return (
    <>
      <Card className="sticky top-24 bg-card border-border p-6 space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Location</p>
              <p className="text-base text-foreground font-medium">{location}</p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Schedule</p>
              <p className="text-sm text-foreground">
                <span className="font-medium">Start:</span> {startDate}
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">End:</span> {endDate}
              </p>
            </div>
          </div>
        </div>

        {/* Organizer */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Organizer</p>
          <p className="text-base text-foreground font-medium">{organizer}</p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 border-t border-border pt-6">
          <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
          
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-primary flex-shrink-0" />
            <a
              href={`mailto:${contactEmail}`}
              className="text-sm text-primary hover:underline"
            >
              {contactEmail}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-primary flex-shrink-0" />
            <a
              href={`tel:${contactPhone}`}
              className="text-sm text-primary hover:underline"
            >
              {contactPhone}
            </a>
          </div>
        </div>

        {/* Enrollment Status */}
        <div className="space-y-2 border-t border-border pt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Enrollment</p>
            <p className="text-sm font-semibold text-foreground">
              {currentEnrollment}/{maxCapacity}
            </p>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentEnrollment / maxCapacity) * 100}%` }}
            />
          </div>
          {isFull && (
            <p className="text-xs text-destructive font-medium">Activity is at full capacity</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 border-t border-border pt-6">
          {isRegistered && registrationId ? (
            <div className="space-y-2">
              <Button
                onClick={() => setShowCheckInDialog(true)}
                variant="outline"
                className="w-full border-border hover:bg-muted font-medium h-10"
              >
                Check-in via QR
              </Button>
              <Button
                onClick={() => setShowProofDialog(true)}
                variant="outline"
                className="w-full border-border hover:bg-muted font-medium h-10"
              >
                Submit Proof
              </Button>
            </div>
          ) : (
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md p-3 text-center">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {isRegistered ? 'Registration in progress...' : 'Please register to submit proof'}
              </p>
            </div>
          )}
        </div>

        {isRegistered && (
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3 text-center">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">
              ✓ Successfully Registered
            </p>
          </div>
        )}
      </Card>

      <CheckInDialog open={showCheckInDialog} onOpenChange={setShowCheckInDialog} />
      {registrationId && (
        <ProofUploadModal
          open={showProofDialog}
          onOpenChange={setShowProofDialog}
          registrationId={registrationId}
          onSuccess={onProofSubmitted}
        />
      )}
    </>
  )
}
