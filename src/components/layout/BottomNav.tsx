import { Home, Search, Sparkles, Plus, MessageCircle, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface BottomNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
  messageCount?: number
}

export function BottomNav({ activeTab, onTabChange, messageCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'browse', icon: Search, label: 'Browse' },
    { id: 'discover', icon: Sparkles, label: 'Discover' },
    { id: 'add', icon: Plus, label: 'Add Item', isSpecial: true },
    { id: 'messages', icon: MessageCircle, label: 'Messages', badge: messageCount },
    { id: 'profile', icon: User, label: 'Profile' }
  ]

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="grid grid-cols-6 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          if (tab.isSpecial) {
            return (
              <div key={tab.id} className="flex justify-center">
                <Button
                  onClick={() => onTabChange(tab.id)}
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                  size="icon"
                >
                  <Icon className="h-6 w-6 text-white" />
                </Button>
              </div>
            )
          }

          return (
            <div key={tab.id} className="flex justify-center">
              <Button
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-2 relative ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}