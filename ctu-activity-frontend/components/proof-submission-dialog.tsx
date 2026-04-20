'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface ProofSubmissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProofSubmissionDialog({ open, onOpenChange }: ProofSubmissionDialogProps) {
  const [proofUrl, setProofUrl] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!proofUrl.trim() || !description.trim()) {
      return
    }

    setIsLoading(true)

    try {
      // TODO: Implement actual proof submission API call
      // Example: await submitProof({ proofUrl, description })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSubmitted(true)

      // Auto-close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
        setProofUrl('')
        setDescription('')
        setSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error('[v0] Proof submission error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setProofUrl('')
      setDescription('')
      setSubmitted(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Activity Proof</DialogTitle>
          <DialogDescription>
            Upload evidence of your participation in this activity.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-foreground">Proof Submitted Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your submission has been recorded and will be reviewed.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Proof URL Field */}
            <div className="space-y-2">
              <Label htmlFor="proof-url" className="text-sm font-medium">
                Proof URL
              </Label>
              <Input
                id="proof-url"
                type="url"
                placeholder="https://example.com/proof-image.jpg"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Link to an image or document proving your participation
              </p>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe what you did and what you learned from this activity..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                className="bg-background border-border focus-visible:ring-primary min-h-24 resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Provide details about your participation (minimum 10 characters)
              </p>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
                Make sure your proof URL is valid and accessible. Admins will review your submission.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleSubmit}
              disabled={!proofUrl.trim() || !description.trim() || isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
            >
              {isLoading ? 'Submitting...' : 'Submit Proof'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
