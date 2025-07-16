import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, MapPin, Clock, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ItemCard } from '@/components/items/ItemCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { Item } from '@/types'

interface DiscoverPageProps {
  onViewItem: (itemId: string) => void
}

export function DiscoverPage({ onViewItem }: DiscoverPageProps) {
  const [recommendedItems, setRecommendedItems] = useState<Item[]>([])
  const [trendingItems, setTrendingItems] = useState<Item[]>([])
  const [nearbyItems, setNearbyItems] = useState<Item[]>([])
  const [recentItems, setRecentItems] = useState<Item[]>([])
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('recommended')

  // Mock user interests for recommendations
  const userInterests = ['Electronics', 'Books', 'Clothing']
  const userLocation = 'San Francisco, CA'

  useEffect(() => {
    loadDiscoverData()
  }, [])

  const loadDiscoverData = async () => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock recommended items based on user interests
    const mockRecommendedItems: Item[] = [
      {
        id: 'rec_1',
        userId: 'user_1',
        title: 'MacBook Pro 13" 2020',
        description: 'Excellent condition MacBook Pro with original charger and box. Perfect for students or professionals.',
        category: 'Electronics',
        condition: 'good',
        listingType: 'swap',
        location: 'San Francisco, CA',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
        isBoosted: true,
        status: 'available',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'rec_2',
        userId: 'user_2',
        title: 'Programming Books Collection',
        description: 'Complete set of modern programming books including React, Node.js, and Python.',
        category: 'Books',
        condition: 'like_new',
        listingType: 'swap',
        location: 'Oakland, CA',
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'rec_3',
        userId: 'user_3',
        title: 'Designer Winter Coat',
        description: 'Stylish winter coat from a premium brand. Barely worn, perfect for the upcoming season.',
        category: 'Clothing',
        condition: 'like_new',
        listingType: 'swap',
        location: 'Berkeley, CA',
        images: ['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'rec_4',
        userId: 'user_4',
        title: 'Wireless Headphones',
        description: 'Sony WH-1000XM4 noise-canceling headphones with case and original accessories.',
        category: 'Electronics',
        condition: 'good',
        listingType: 'swap',
        location: 'San Francisco, CA',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'],
        isBoosted: true,
        status: 'available',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // Mock trending items
    const mockTrendingItems: Item[] = [
      {
        id: 'trend_1',
        userId: 'user_5',
        title: 'Vintage Vinyl Records',
        description: 'Collection of classic rock and jazz vinyl records from the 70s and 80s.',
        category: 'Music',
        condition: 'good',
        listingType: 'swap',
        location: 'San Francisco, CA',
        images: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'],
        isBoosted: true,
        status: 'available',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'trend_2',
        userId: 'user_6',
        title: 'Indoor Plant Starter Kit',
        description: 'Perfect for beginners! Includes 5 easy-to-care-for plants with pots and care instructions.',
        category: 'Home & Garden',
        condition: 'new',
        listingType: 'donation',
        location: 'Oakland, CA',
        images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'trend_3',
        userId: 'user_7',
        title: 'Gaming Setup Bundle',
        description: 'Complete gaming setup including mechanical keyboard, gaming mouse, and mousepad.',
        category: 'Electronics',
        condition: 'good',
        listingType: 'swap',
        location: 'San Jose, CA',
        images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400'],
        isBoosted: true,
        status: 'available',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // Mock nearby items
    const mockNearbyItems: Item[] = [
      {
        id: 'nearby_1',
        userId: 'user_8',
        title: 'Coffee Table',
        description: 'Modern glass coffee table in excellent condition. Perfect for small apartments.',
        category: 'Furniture',
        condition: 'good',
        listingType: 'swap',
        location: 'San Francisco, CA - 0.5 miles away',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'nearby_2',
        userId: 'user_9',
        title: 'Yoga Mat & Blocks',
        description: 'High-quality yoga mat with blocks and strap. Great for home workouts.',
        category: 'Sports',
        condition: 'like_new',
        listingType: 'donation',
        location: 'San Francisco, CA - 1.2 miles away',
        images: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    // Mock recent items
    const mockRecentItems: Item[] = [
      {
        id: 'recent_1',
        userId: 'user_10',
        title: 'Art Supplies Set',
        description: 'Complete set of acrylic paints, brushes, and canvases. Perfect for beginners.',
        category: 'Other',
        condition: 'good',
        listingType: 'donation',
        location: 'Berkeley, CA',
        images: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'recent_2',
        userId: 'user_11',
        title: 'Board Games Collection',
        description: 'Family-friendly board games including Monopoly, Scrabble, and Settlers of Catan.',
        category: 'Toys',
        condition: 'good',
        listingType: 'swap',
        location: 'Oakland, CA',
        images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    setRecommendedItems(mockRecommendedItems)
    setTrendingItems(mockTrendingItems)
    setNearbyItems(mockNearbyItems)
    setRecentItems(mockRecentItems)
    setIsLoading(false)
  }

  const handleFavorite = (itemId: string) => {
    setFavoriteItems(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId)
      } else {
        newFavorites.add(itemId)
      }
      return newFavorites
    })
  }

  const handleRefresh = () => {
    loadDiscoverData()
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <Card key={i}>
          <div className="aspect-square">
            <Skeleton className="w-full h-full rounded-t-lg" />
          </div>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Discover
          </h1>
          <p className="text-muted-foreground">
            Personalized recommendations just for you
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* User Context */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-semibold mb-2">Recommendations based on your profile</h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{userLocation}</span>
                </div>
                <span>•</span>
                <span>Interests:</span>
                {userInterests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommended" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            For You
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trending
          </TabsTrigger>
          <TabsTrigger value="nearby" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Nearby
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent
          </TabsTrigger>
        </TabsList>

        {/* Recommended Items */}
        <TabsContent value="recommended" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recommended for You</h3>
            <Badge variant="outline">{recommendedItems.length} items</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Based on your interests in {userInterests.join(', ')} and your location
          </p>
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFavorite={handleFavorite}
                  onViewDetails={onViewItem}
                  isFavorited={favoriteItems.has(item.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Trending Items */}
        <TabsContent value="trending" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Trending Items</h3>
            <Badge variant="outline">{trendingItems.length} items</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Most popular items in your area right now
          </p>
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFavorite={handleFavorite}
                  onViewDetails={onViewItem}
                  isFavorited={favoriteItems.has(item.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Nearby Items */}
        <TabsContent value="nearby" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Items Near You</h3>
            <Badge variant="outline">{nearbyItems.length} items</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Items within 5 miles of {userLocation}
          </p>
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFavorite={handleFavorite}
                  onViewDetails={onViewItem}
                  isFavorited={favoriteItems.has(item.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Recent Items */}
        <TabsContent value="recent" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recently Added</h3>
            <Badge variant="outline">{recentItems.length} items</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Fresh items added in the last 24 hours
          </p>
          
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFavorite={handleFavorite}
                  onViewDetails={onViewItem}
                  isFavorited={favoriteItems.has(item.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {!isLoading && activeTab === 'recommended' && recommendedItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No recommendations yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete your profile and add interests to get personalized recommendations
            </p>
            <Button>Update Profile</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}