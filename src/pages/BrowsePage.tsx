import { useState, useEffect } from 'react'
import { Search, Filter, Grid, Map, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ItemCard } from '@/components/items/ItemCard'
import type { Item } from '@/types'

interface BrowsePageProps {
  onViewItem: (itemId: string) => void
}

const categories = [
  'All Categories',
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
  { value: 'all', label: 'All Conditions' },
  { value: 'new', label: 'New' },
  { value: 'like_new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
]

export function BrowsePage({ onViewItem }: BrowsePageProps) {
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [favoriteItems, setFavoriteItems] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [selectedListingType, setSelectedListingType] = useState('all')
  const [maxDistance, setMaxDistance] = useState([50])
  const [showBoostedOnly, setShowBoostedOnly] = useState(false)

  // Mock data
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
        title: 'MacBook Pro 13" 2019',
        description: 'Well-maintained MacBook Pro with original charger and box. Great for students.',
        category: 'Electronics',
        condition: 'good',
        listingType: 'swap',
        location: 'Tech District',
        images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        userId: 'user3',
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
        id: '4',
        userId: 'user4',
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
        id: '5',
        userId: 'user5',
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
      },
      {
        id: '6',
        userId: 'user6',
        title: 'Gaming Chair',
        description: 'Ergonomic gaming chair with lumbar support. Minor wear on armrests.',
        category: 'Furniture',
        condition: 'good',
        listingType: 'swap',
        location: 'Gaming District',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '7',
        userId: 'user7',
        title: 'Children\'s Toy Collection',
        description: 'Various educational toys and games for ages 3-8. All clean and sanitized.',
        category: 'Toys',
        condition: 'good',
        listingType: 'donation',
        location: 'Family Neighborhood',
        images: ['https://images.unsplash.com/photo-1558877385-1c2d7b8b8b8b?w=400'],
        isBoosted: true,
        status: 'available',
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '8',
        userId: 'user8',
        title: 'Tennis Racket Set',
        description: 'Professional tennis rackets with carrying case. Perfect for beginners.',
        category: 'Sports',
        condition: 'like_new',
        listingType: 'swap',
        location: 'Sports Complex Area',
        images: ['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'],
        isBoosted: false,
        status: 'available',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
    setItems(mockItems)
    setFilteredItems(mockItems)
  }, [])

  // Filter items based on search and filters
  useEffect(() => {
    let filtered = items

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Condition filter
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(item => item.condition === selectedCondition)
    }

    // Listing type filter
    if (selectedListingType !== 'all') {
      filtered = filtered.filter(item => item.listingType === selectedListingType)
    }

    // Boosted filter
    if (showBoostedOnly) {
      filtered = filtered.filter(item => item.isBoosted)
    }

    setFilteredItems(filtered)
  }, [items, searchQuery, selectedCategory, selectedCondition, selectedListingType, showBoostedOnly])

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

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All Categories')
    setSelectedCondition('all')
    setSelectedListingType('all')
    setMaxDistance([50])
    setShowBoostedOnly(false)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Category</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
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

      {/* Condition Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Condition</label>
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {conditions.map(condition => (
              <SelectItem key={condition.value} value={condition.value}>
                {condition.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Listing Type Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">Listing Type</label>
        <Select value={selectedListingType} onValueChange={setSelectedListingType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="swap">Swap Only</SelectItem>
            <SelectItem value="donation">Donations Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Distance Filter */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          Max Distance: {maxDistance[0]} km
        </label>
        <Slider
          value={maxDistance}
          onValueChange={setMaxDistance}
          max={100}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      {/* Boosted Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="boosted"
          checked={showBoostedOnly}
          onCheckedChange={setShowBoostedOnly}
        />
        <label htmlFor="boosted" className="text-sm font-medium">
          Show boosted items only
        </label>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Browse Items</h1>
          <p className="text-muted-foreground">
            Discover amazing items in your community
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <Map className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block w-80">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>
              <FilterContent />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar and Mobile Filter */}
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Mobile Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                {filteredItems.length} items found
              </p>
              {(searchQuery || selectedCategory !== 'All Categories' || selectedCondition !== 'all' || selectedListingType !== 'all' || showBoostedOnly) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Filters:</span>
                  <div className="flex gap-1 flex-wrap">
                    {searchQuery && (
                      <Badge variant="secondary">
                        Search: {searchQuery}
                      </Badge>
                    )}
                    {selectedCategory !== 'All Categories' && (
                      <Badge variant="secondary">
                        {selectedCategory}
                      </Badge>
                    )}
                    {selectedCondition !== 'all' && (
                      <Badge variant="secondary">
                        {conditions.find(c => c.value === selectedCondition)?.label}
                      </Badge>
                    )}
                    {selectedListingType !== 'all' && (
                      <Badge variant="secondary">
                        {selectedListingType === 'swap' ? 'Swap Only' : 'Donations Only'}
                      </Badge>
                    )}
                    {showBoostedOnly && (
                      <Badge variant="secondary">
                        Boosted Only
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="boosted">Boosted First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Grid or Map */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onFavorite={handleFavorite}
                  onViewDetails={onViewItem}
                  isFavorited={favoriteItems.has(item.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="h-96">
              <CardContent className="p-6 h-full flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Map View</h3>
                  <p className="text-sm text-muted-foreground">
                    Interactive map view coming soon
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No items found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Try adjusting your search or filters to find more items.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}