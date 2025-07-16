import { Heart, MapPin, Clock, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Item } from '@/types'

interface ItemCardProps {
  item: Item
  onFavorite?: (itemId: string) => void
  onViewDetails?: (itemId: string) => void
  isFavorited?: boolean
}

export function ItemCard({ item, onFavorite, onViewDetails, isFavorited = false }: ItemCardProps) {
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

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        {/* Item Image */}
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <span className="text-gray-400 text-sm">No image</span>
            </div>
          )}
          
          {/* Boost Indicator */}
          {item.isBoosted && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <Zap className="h-3 w-3 mr-1" />
                Boosted
              </Badge>
            </div>
          )}

          {/* Listing Type */}
          <div className="absolute top-2 right-2">
            <Badge variant={item.listingType === 'donation' ? 'secondary' : 'default'}>
              {item.listingType === 'donation' ? 'Free' : 'Swap'}
            </Badge>
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              onFavorite?.(item.id)
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="font-semibold text-lg line-clamp-1 mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
          </div>

          {/* Condition and Category */}
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getConditionColor(item.condition)} variant="secondary">
              {item.condition.replace('_', ' ')}
            </Badge>
            <Badge variant="outline">{item.category}</Badge>
          </div>

          {/* Location and Time */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="line-clamp-1">{item.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTimeAgo(item.createdAt)}</span>
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="" />
                <AvatarFallback className="text-xs">U</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">Owner</span>
            </div>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails?.(item.id)
              }}
            >
              View Details
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}