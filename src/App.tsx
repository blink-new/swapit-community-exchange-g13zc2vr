import { useState, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { HomePage } from '@/pages/HomePage'
import { BrowsePage } from '@/pages/BrowsePage'
import { AddItemPage } from '@/pages/AddItemPage'
import { ItemDetailsPage } from '@/pages/ItemDetailsPage'
import { MessagesPage } from '@/pages/MessagesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { Toaster } from '@/components/ui/toaster'
import { blink } from '@/blink/client'
import type { User } from '@/types'

type AppView = 'home' | 'browse' | 'add' | 'messages' | 'profile' | 'item-details'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('home')
  const [currentView, setCurrentView] = useState<AppView>('home')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)

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
    setCurrentView('add')
    setActiveTab('add')
  }

  const handleViewItem = (itemId: string) => {
    setSelectedItemId(itemId)
    setCurrentView('item-details')
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
    setCurrentView('browse')
    setActiveTab('browse')
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    switch (tab) {
      case 'home':
        setCurrentView('home')
        break
      case 'browse':
        setCurrentView('browse')
        break
      case 'add':
        setCurrentView('add')
        break
      case 'messages':
        setCurrentView('messages')
        break
      case 'profile':
        setCurrentView('profile')
        break
    }
  }

  const handleBack = () => {
    setCurrentView('home')
    setActiveTab('home')
    setSelectedItemId(null)
  }

  const handleItemAdded = () => {
    setCurrentView('home')
    setActiveTab('home')
  }

  const handleStartMessage = (userId: string) => {
    console.log('Start message with user:', userId)
    setCurrentView('messages')
    setActiveTab('messages')
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onAddItem={handleAddItem} onViewItem={handleViewItem} />
      case 'browse':
        return <BrowsePage onViewItem={handleViewItem} />
      case 'add':
        return <AddItemPage onBack={handleBack} onItemAdded={handleItemAdded} />
      case 'item-details':
        return selectedItemId ? (
          <ItemDetailsPage 
            itemId={selectedItemId} 
            onBack={handleBack} 
            onStartMessage={handleStartMessage}
          />
        ) : null
      case 'messages':
        return <MessagesPage onBack={handleBack} />
      case 'profile':
        return <ProfilePage onBack={handleBack} onViewItem={handleViewItem} />
      default:
        return <HomePage onAddItem={handleAddItem} onViewItem={handleViewItem} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {currentView !== 'add' && currentView !== 'item-details' && currentView !== 'messages' && currentView !== 'profile' && (
        <Header onSearch={handleSearch} />
      )}
      
      <main className={`container mx-auto px-4 ${
        currentView === 'add' || currentView === 'item-details' || currentView === 'messages' || currentView === 'profile' 
          ? 'py-8' 
          : 'py-8 pb-20 md:pb-8'
      }`}>
        {renderCurrentView()}
      </main>

      {currentView !== 'add' && currentView !== 'item-details' && currentView !== 'messages' && currentView !== 'profile' && (
        <BottomNav 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          messageCount={2}
        />
      )}
      
      <Toaster />
    </div>
  )
}

export default App