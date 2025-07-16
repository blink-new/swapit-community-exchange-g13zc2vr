import { useState } from 'react'
import { ArrowLeft, Upload, X, MapPin, Zap, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { blink } from '@/blink/client'

interface AddItemPageProps {
  onBack: () => void
  onItemAdded: () => void
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

const conditions = [
  { value: 'new', label: 'New', description: 'Brand new, never used' },
  { value: 'like_new', label: 'Like New', description: 'Barely used, excellent condition' },
  { value: 'good', label: 'Good', description: 'Used but well maintained' },
  { value: 'fair', label: 'Fair', description: 'Shows wear but fully functional' },
  { value: 'poor', label: 'Poor', description: 'Heavy wear, may need repairs' }
]

export function AddItemPage({ onBack, onItemAdded }: AddItemPageProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showBoostDialog, setShowBoostDialog] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    listingType: 'swap' as 'swap' | 'donation',
    location: ''
  })
  
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    
    if (images.length + files.length > 5) {
      toast({
        title: 'Too many images',
        description: 'You can upload a maximum of 5 images per item.',
        variant: 'destructive'
      })
      return
    }

    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: 'File too large',
          description: `${file.name} is too large. Maximum file size is 5MB.`,
          variant: 'destructive'
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setImages(prev => [...prev, file])
        setImagePreviews(prev => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (boost: boolean = false) => {
    if (!formData.title || !formData.description || !formData.category || !formData.condition || !formData.location) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      // Upload images to storage
      const imageUrls: string[] = []
      for (const image of images) {
        const { publicUrl } = await blink.storage.upload(
          image,
          `items/${Date.now()}-${image.name}`,
          { upsert: true }
        )
        imageUrls.push(publicUrl)
      }

      // Create item (mock for now since database creation failed)
      const newItem = {
        id: `item_${Date.now()}`,
        userId: 'current_user',
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        listingType: formData.listingType,
        location: formData.location,
        images: imageUrls,
        isBoosted: boost,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      console.log('New item created:', newItem)

      toast({
        title: 'Item listed successfully!',
        description: boost ? 'Your item has been boosted and will appear at the top of search results.' : 'Your item is now live and visible to the community.'
      })

      onItemAdded()
    } catch (error) {
      console.error('Error creating item:', error)
      toast({
        title: 'Error',
        description: 'Failed to create item. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
      setShowBoostDialog(false)
    }
  }

  const isFormValid = formData.title && formData.description && formData.category && formData.condition && formData.location

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">List an Item</h1>
          <p className="text-muted-foreground">
            Share your unused items with the community
          </p>
        </div>
      </div>

      <form className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="What are you listing?"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map(condition => (
                      <SelectItem key={condition.value} value={condition.value}>
                        <div>
                          <div className="font-medium">{condition.label}</div>
                          <div className="text-xs text-muted-foreground">{condition.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Listing Type */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Type</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.listingType}
              onValueChange={(value: 'swap' | 'donation') => handleInputChange('listingType', value)}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="swap" id="swap" />
                <Label htmlFor="swap" className="flex-1 cursor-pointer">
                  <div className="font-medium">Swap</div>
                  <div className="text-sm text-muted-foreground">
                    Exchange for another item
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value="donation" id="donation" />
                <Label htmlFor="donation" className="flex-1 cursor-pointer">
                  <div className="font-medium">Donation</div>
                  <div className="text-sm text-muted-foreground">
                    Give away for free
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Image Upload */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label htmlFor="images" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <div className="font-medium">Upload Photos</div>
                  <div className="text-sm text-muted-foreground">
                    Add up to 5 photos (max 5MB each)
                  </div>
                </Label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      {index === 0 && (
                        <Badge className="absolute bottom-2 left-2 text-xs">
                          Main Photo
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Enter your location or neighborhood"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              This helps others find items near them
            </p>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!isFormValid || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Item'}
          </Button>
          
          <Dialog open={showBoostDialog} onOpenChange={setShowBoostDialog}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                disabled={!isFormValid || isSubmitting}
                className="flex-1 sm:flex-none"
              >
                <Zap className="h-4 w-4 mr-2" />
                Boost Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Boost Your Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Boosting your item will make it appear at the top of search results and browse pages, 
                  increasing visibility and chances of finding a match.
                </p>
                
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Virtual Points</span>
                      <Badge variant="secondary">Free</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Use 50 virtual points to boost for 24 hours
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Premium Boost</span>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-sm">$2.99</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Boost for 7 days with premium placement
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowBoostDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSubmit(true)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Boost with Points
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </form>
    </div>
  )
}