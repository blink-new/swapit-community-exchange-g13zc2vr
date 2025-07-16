import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomePage } from '@/pages/HomePage'
import { Toaster } from '@/components/ui/toaster'
import { blink } from '@/blink/client'
import type { User } from '@/types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser({
          id: state.user.id,
          email: state.user.email || '',
          displayName: state.user.displayName || 'User',
          avatar: state.user.avatar,
          onboardingCompleted: true,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleAddItem = () => {
    setActiveTab('add')
    // TODO: Navigate to add item page
  }

  const handleViewItem = (itemId: string) => {
    console.log('View item:', itemId)
    // TODO: Navigate to item details page
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
    // TODO: Implement search functionality
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <p className="text-muted-foreground">Loading SwapIt...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-6 mx-auto">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">Welcome to SwapIt</h1>
          <p className="text-muted-foreground mb-8">
            Join our community to swap, donate, and discover amazing items while promoting sustainable living.
          </p>
          <p className="text-sm text-muted-foreground">
            Please sign in to continue...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        {activeTab === 'home' && (
          <HomePage onAddItem={handleAddItem} onViewItem={handleViewItem} />
        )}
        {activeTab === 'browse' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Browse Items</h2>
            <p className="text-muted-foreground">Browse page coming soon...</p>
          </div>
        )}
        {activeTab === 'add' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Add Item</h2>
            <p className="text-muted-foreground">Add item page coming soon...</p>
          </div>
        )}
        {activeTab === 'messages' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <p className="text-muted-foreground">Messages page coming soon...</p>
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-muted-foreground">Profile page coming soon...</p>
          </div>
        )}
      </main>

      <BottomNav 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        messageCount={2}
      />
      
      <Toaster />
    </div>
  )
}

export default App