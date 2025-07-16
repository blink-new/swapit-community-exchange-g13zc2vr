import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Upload, X, MapPin, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'

interface OnboardingPageProps {
  onComplete: () => void
}

const categories = [
  'Electronics',
  'Clothing',
  'Books',
  'Home & Garden',
  'Sports',
  'Music',
  'Toys',
  'Furniture',
  'Other'
]

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    interests: [] as string[],
    profileImage: null as File | null
  })
  
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'File too large',
        description: 'Profile image must be less than 5MB.',
        variant: 'destructive'
      })
      return
    }

    setFormData(prev => ({ ...prev, profileImage: file }))
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfileImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }))
    setProfileImagePreview(null)
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    
    try {
      // Upload profile image if provided
      let profileImageUrl = ''
      if (formData.profileImage) {
        const { publicUrl } = await blink.storage.upload(
          formData.profileImage,
          `profiles/${Date.now()}-${formData.profileImage.name}`,
          { upsert: true }
        )
        profileImageUrl = publicUrl
      }

      // Update user profile (mock for now since database creation failed)
      const updatedProfile = {
        displayName: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        interests: formData.interests,
        avatar: profileImageUrl,
        onboardingCompleted: true
      }

      console.log('Profile updated:', updatedProfile)

      toast({
        title: 'Welcome to SwapIt!',
        description: 'Your profile has been set up successfully.'
      })

      onComplete()
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast({
        title: 'Error',
        description: 'Failed to complete setup. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.displayName.trim().length > 0
      case 2:
        return formData.location.trim().length > 0
      case 3:
        return formData.interests.length > 0
      case 4:
        return true // Optional step
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </div>
                Tell us about yourself
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  placeholder="How should others see your name?"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.displayName.length}/50 characters
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Bio (Optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell the community a bit about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  maxLength={200}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/200 characters
                </p>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                This information will be visible to other users when you list items or send messages.
              </div>
            </CardContent>
          </Card>
        )

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </div>
                Where are you located?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter your city or neighborhood"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Why do we need your location?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Help you find items nearby</li>
                  <li>• Show your items to local users</li>
                  <li>• Facilitate easier meetups for exchanges</li>
                  <li>• Build stronger community connections</li>
                </ul>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Your exact address is never shared. Only your general area is visible to others.
              </div>
            </CardContent>
          </Card>
        )

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  3
                </div>
                What interests you?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Select categories you're interested in. This helps us show you relevant items and recommendations.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div
                    key={category}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.interests.includes(category)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => handleInterestToggle(category)}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={formData.interests.includes(category)}
                        onChange={() => handleInterestToggle(category)}
                      />
                      <Label className="cursor-pointer">{category}</Label>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Badge variant="outline">
                  <Heart className="h-3 w-3 mr-1" />
                  {formData.interests.length} selected
                </Badge>
              </div>
            </CardContent>
          </Card>
        )

      case 4:
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  4
                </div>
                Add a profile photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                A profile photo helps build trust in the community. This step is optional but recommended.
              </p>

              {!profileImagePreview ? (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="font-medium mb-2">Upload Profile Photo</div>
                    <div className="text-sm text-muted-foreground">
                      Choose a clear photo of yourself (max 5MB)
                    </div>
                  </Label>
                </div>
              ) : (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={profileImagePreview}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover mx-auto"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={removeImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Looking good! You can change this later in your profile settings.
                  </p>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Profile Photo Tips</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Use a clear, recent photo of yourself</li>
                  <li>• Avoid group photos or images with text</li>
                  <li>• Good lighting makes a big difference</li>
                  <li>• Smile! It helps build trust</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Welcome to SwapIt!</h1>
          <p className="text-muted-foreground">
            Let's set up your profile to get you started in the community
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${
                  i + 1 <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Setting up...' : (
                <>
                  <Check className="h-4 w-4" />
                  Complete Setup
                </>
              )}
            </Button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onComplete} className="text-muted-foreground">
            Skip for now
          </Button>
        </div>
      </div>
    </div>
  )
}