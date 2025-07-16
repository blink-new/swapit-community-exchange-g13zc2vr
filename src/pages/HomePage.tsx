import { useState, useEffect } from 'react'
import { Plus, TrendingUp, Users, Recycle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ItemCard } from '@/components/items/ItemCard'
import type { Item } from '@/types'

interface HomePageProps {
  onAddItem: () => void
  onViewItem: (itemId: string) => void
}

export function HomePage({ onAddItem, onViewItem }: HomePageProps) {
  const [recentItems, setRecentItems] = useState<Item[]>([])
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set())

  // Mock data for demonstration
  useEffect(() => {
    const mockItems: Item[] = [
      {
        id: '1',
        userId: 'user1',
        title: 'Vintage Leather Jacket',
        description: 'Classic brown leather jacket in excellent condition. Perfect for fall weather.',
        category: 'Clothing',
        condition: 'good',
        listingType: 'swap',
        location: 'Downtown, City Center',
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400'],
        isBoosted: true,
        status: 'available',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'user2',
        title: 'Coffee Table Books Set',
        description: 'Beautiful collection of photography and art books. Great for coffee table display.',
        category: 'Books',
        condition: 'like_new',
        listingType: 'donation',
        location: 'Westside, Residential',
        images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        userId: 'user3',
        title: 'Acoustic Guitar',
        description: 'Yamaha acoustic guitar with case. Some wear but sounds great.',
        category: 'Music',
        condition: 'fair',
        listingType: 'swap',
        location: 'Eastside, University Area',
        images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        userId: 'user4',
        title: 'Indoor Plant Collection',
        description: 'Various houseplants including pothos, snake plant, and rubber tree.',
        category: 'Home & Garden',
        condition: 'good',
        listingType: 'donation',
        location: 'Northside, Suburbs',
        images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400'],
        isBoosted: true,
        status: 'available',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    setRecentItems(mockItems)
  }, [])

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

  const stats = [
    { title: 'Items Swapped', value: '1,234', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Active Users', value: '856', icon: Users, color: 'text-blue-600' },
    { title: 'Items Donated', value: '2,891', icon: Recycle, color: 'text-purple-600' }
  ]

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
          Welcome to SwapIt
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Give your unused items a second life. Swap, donate, and connect with your community 
          while promoting sustainable living.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onAddItem} className="gap-2">
            <Plus className="h-5 w-5" />
            List Your First Item
          </Button>
          <Button size="lg" variant="outline">
            Browse Items
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Recent Items */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recent Items</h2>
            <p className="text-muted-foreground">Discover what's new in your community</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      </section>

      {/* Call to Action */}
      <section className="text-center py-12 bg-primary/5 rounded-2xl">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Swapping?</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          Join thousands of users who are already making a positive impact on their community 
          and the environment.
        </p>
        <Button size="lg" onClick={onAddItem}>
          List Your First Item
        </Button>
      </section>
    </div>
  )
}