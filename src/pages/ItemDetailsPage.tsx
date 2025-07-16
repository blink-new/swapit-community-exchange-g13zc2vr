import { useState, useEffect } from 'react'
import { ArrowLeft, Heart, MapPin, Clock, User, MessageCircle, Zap, Share2, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import type { Item } from '@/types'

interface ItemDetailsPageProps {
  itemId: string
  onBack: () => void
  onStartMessage: (userId: string) => void
}

export function ItemDetailsPage({ itemId, onBack, onStartMessage }: ItemDetailsPageProps) {
  const { toast } = useToast()
  const [item, setItem] = useState<Item | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showProposalDialog, setShowProposalDialog] = useState(false)
  const [proposalMessage, setProposalMessage] = useState('')
  const [selectedOfferItem, setSelectedOfferItem] = useState('')
  const [userItems, setUserItems] = useState<Item[]>([])
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false)

  // Mock data - in real app, fetch from API
  useEffect(() => {
    const mockItem: Item = {
      id: itemId,
      userId: 'user1',
      title: 'Vintage Leather Jacket',
      description: 'Classic brown leather jacket in excellent condition. Perfect for fall weather. This jacket has been well-maintained and comes from a smoke-free home. The leather is supple and the zippers work perfectly. Great for casual wear or motorcycle riding.',
      category: 'Clothing',
      condition: 'good',
      listingType: 'swap',
      location: 'Downtown, City Center',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600',
        'https://images.unsplash.com/photo-1520975954732-35dd22299614?w=600',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600'
      ],
      isBoosted: true,
      status: 'available',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
    setItem(mockItem)

    // Mock user items for swap proposals
    const mockUserItems: Item[] = [
      {
        id: 'user_item_1',
        userId: 'current_user',
        title: 'Denim Jacket',
        description: 'Classic blue denim jacket',
        category: 'Clothing',
        condition: 'good',
        listingType: 'swap',
        location: 'My Location',
        images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'user_item_2',
        userId: 'current_user',
        title: 'Wool Sweater',
        description: 'Cozy wool sweater in great condition',
        category: 'Clothing',
        condition: 'like_new',
        listingType: 'swap',
        location: 'My Location',
        images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    setUserItems(mockUserItems)
  }, [itemId])

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'like_new': return 'bg-blue-100 text-blue-800'
      case 'good': return 'bg-yellow-100 text-yellow-800'
      case 'fair': return 'bg-orange-100 text-orange-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return date.toLocaleDateString()
  }

  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
    toast({
      title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      description: isFavorited ? 'Item removed from your favorites list.' : 'Item added to your favorites list.'
    })
  }

  const handleSubmitProposal = async () => {
    if (!item) return
    
    if (item.listingType === 'swap' && !selectedOfferItem) {
      toast({
        title: 'Select an item to offer',
        description: 'Please select an item from your listings to propose for this swap.',
        variant: 'destructive'
      })
      return
    }

    setIsSubmittingProposal(true)
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const proposalType = item.listingType === 'donation' ? 'donation request' : 'swap proposal'
      
      toast({
        title: `${proposalType.charAt(0).toUpperCase() + proposalType.slice(1)} sent!`,
        description: 'The owner will be notified and can respond to your request.'
      })
      
      setShowProposalDialog(false)
      setProposalMessage('')
      setSelectedOfferItem('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send proposal. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmittingProposal(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: item?.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copied',
        description: 'Item link copied to clipboard.'
      })
    }
  }

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{item.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>{item.location}</span>
            <span>•</span>
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(item.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleFavorite}>
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={item.images[currentImageIndex]}
                  alt={item.title}
                  className="w-full h-96 object-cover rounded-t-lg"
                />
                
                {/* Boost Indicator */}
                {item.isBoosted && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                      <Zap className="h-3 w-3 mr-1" />
                      Boosted
                    </Badge>
                  </div>
                )}

                {/* Listing Type */}
                <div className="absolute top-4 right-4">
                  <Badge variant={item.listingType === 'donation' ? 'secondary' : 'default'}>
                    {item.listingType === 'donation' ? 'Free' : 'Swap'}
                  </Badge>
                </div>

                {/* Image Navigation */}
                {item.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <div className="flex gap-2">
                      {item.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Strip */}
              {item.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {item.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${item.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{item.description}</p>
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium">Category</span>
                  <p className="text-muted-foreground">{item.category}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Condition</span>
                  <div className="mt-1">
                    <Badge className={getConditionColor(item.condition)} variant="secondary">
                      {item.condition.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium">Location</span>
                <p className="text-muted-foreground">{item.location}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-muted-foreground">Member since 2023</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Items listed</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Successful swaps</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Response rate</span>
                  <span className="font-medium">95%</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onStartMessage(item.userId)}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Dialog open={showProposalDialog} onOpenChange={setShowProposalDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      {item.listingType === 'donation' ? 'Request Item' : 'Propose Swap'}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {item.listingType === 'donation' ? 'Request Item' : 'Propose Swap'}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {item.listingType === 'swap' && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Select item to offer
                          </label>
                          <Select value={selectedOfferItem} onValueChange={setSelectedOfferItem}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose from your items" />
                            </SelectTrigger>
                            <SelectContent>
                              {userItems.map(userItem => (
                                <SelectItem key={userItem.id} value={userItem.id}>
                                  <div className="flex items-center gap-2">
                                    <img
                                      src={userItem.images[0]}
                                      alt={userItem.title}
                                      className="w-8 h-8 object-cover rounded"
                                    />
                                    <span>{userItem.title}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                      
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Message (optional)
                        </label>
                        <Textarea
                          placeholder={item.listingType === 'donation' 
                            ? 'Tell the owner why you\'d like this item...'
                            : 'Explain why this would be a good swap...'}
                          value={proposalMessage}
                          onChange={(e) => setProposalMessage(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowProposalDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitProposal}
                          disabled={isSubmittingProposal || (item.listingType === 'swap' && !selectedOfferItem)}
                          className="flex-1"
                        >
                          {isSubmittingProposal ? 'Sending...' : 'Send'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline" className="w-full">
                  <Flag className="h-4 w-4 mr-2" />
                  Report Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Similar Items */}
          <Card>
            <CardHeader>
              <CardTitle>Similar Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                    <img
                      src={`https://images.unsplash.com/photo-155102871933${i}?w=100`}
                      alt="Similar item"
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">Similar Item {i}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">Great condition</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        Swap
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}