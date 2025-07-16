export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  bio?: string
  location?: string
  interests?: string[]
  onboardingCompleted: boolean
  role: 'user' | 'admin' | 'partner'
  createdAt: string
  updatedAt: string
}

export interface Item {
  id: string
  userId: string
  title: string
  description: string
  category: string
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
  listingType: 'swap' | 'donation'
  location: string
  images: string[]
  isBoosted: boolean
  boostEndDate?: string
  status: 'available' | 'pending' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: string
  itemId: string
  requesterId: string
  ownerId: string
  offeredItemId?: string
  status: 'proposed' | 'accepted' | 'rejected' | 'completed'
  message?: string
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface Conversation {
  id: string
  participants: string[]
  lastMessage?: Message
  unreadCount: number
  createdAt: string
  updatedAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'message' | 'item_boosted'
  title: string
  content: string
  isRead: boolean
  relatedId?: string
  createdAt: string
}

export interface Partner {
  id: string
  businessName: string
  category: string
  location: string
  description: string
  contactInfo: string
  dropOffPoints: DropOffPoint[]
  status: 'active' | 'inactive'
  createdAt: string
}

export interface DropOffPoint {
  id: string
  partnerId: string
  name: string
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  schedule: string
  isActive: boolean
}