import { useState, useEffect } from 'react'
import { ArrowLeft, Bell, Check, CheckCheck, MessageCircle, Heart, Zap, Package, User, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import type { Notification } from '@/types'

interface NotificationsPageProps {
  onBack?: () => void
  onNavigate?: (page: string, itemId?: string) => void
}

export function NotificationsPage({ onBack, onNavigate }: NotificationsPageProps) {
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [activeTab, setActiveTab] = useState('all')
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = () => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: 'notif_1',
        userId: 'current_user',
        type: 'swap_request',
        title: 'New Swap Proposal',
        content: 'Sarah Johnson wants to swap her "Denim Jacket" for your "Vintage Leather Jacket"',
        isRead: false,
        relatedId: 'item_1',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_2',
        userId: 'current_user',
        type: 'message',
        title: 'New Message',
        content: 'Mike Chen sent you a message about "Programming Books Collection"',
        isRead: false,
        relatedId: 'conv_2',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_3',
        userId: 'current_user',
        type: 'swap_accepted',
        title: 'Swap Accepted!',
        content: 'Emma Davis accepted your swap proposal for "Acoustic Guitar"',
        isRead: false,
        relatedId: 'item_3',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_4',
        userId: 'current_user',
        type: 'item_boosted',
        title: 'Item Boosted',
        content: 'Your "Bluetooth Headphones" listing has been boosted and is now featured',
        isRead: true,
        relatedId: 'item_4',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_5',
        userId: 'current_user',
        type: 'swap_request',
        title: 'Donation Request',
        content: 'Alex Wilson requested your "Indoor Plant Collection" donation',
        isRead: true,
        relatedId: 'item_5',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_6',
        userId: 'current_user',
        type: 'swap_rejected',
        title: 'Swap Declined',
        content: 'Your swap proposal for "Gaming Chair" was declined',
        isRead: true,
        relatedId: 'item_6',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif_7',
        userId: 'current_user',
        type: 'message',
        title: 'New Message',
        content: 'Lisa Park sent you a message about "Coffee Table Books Set"',
        isRead: true,
        relatedId: 'conv_3',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    setNotifications(mockNotifications)
    setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'swap_request':
      case 'swap_accepted':
      case 'swap_rejected':
        return <Package className="h-4 w-4" />
      case 'message':
        return <MessageCircle className="h-4 w-4" />
      case 'item_boosted':
        return <Zap className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'swap_accepted':
        return 'text-green-600 bg-green-100'
      case 'swap_rejected':
        return 'text-red-600 bg-red-100'
      case 'swap_request':
        return 'text-blue-600 bg-blue-100'
      case 'message':
        return 'text-purple-600 bg-purple-100'
      case 'item_boosted':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString()
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      setNotifications(prev => prev.map(n => 
        n.id === notification.id ? { ...n, isRead: true } : n
      ))
      setUnreadCount(prev => prev - 1)
    }

    // Navigate to related content
    if (onNavigate && notification.relatedId) {
      switch (notification.type) {
        case 'swap_request':
        case 'swap_accepted':
        case 'swap_rejected':
        case 'item_boosted':
          onNavigate('item-details', notification.relatedId)
          break
        case 'message':
          onNavigate('messages', notification.relatedId)
          break
      }
    }
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
    toast({
      title: 'All notifications marked as read',
      description: 'Your notification list has been updated.'
    })
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId)
      const filtered = prev.filter(n => n.id !== notificationId)
      
      if (notification && !notification.isRead) {
        setUnreadCount(count => count - 1)
      }
      
      return filtered
    })
    
    toast({
      title: 'Notification deleted',
      description: 'The notification has been removed.'
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
    toast({
      title: 'All notifications cleared',
      description: 'Your notification list has been cleared.'
    })
  }

  const filterNotifications = (type: string) => {
    if (type === 'all') return notifications
    if (type === 'unread') return notifications.filter(n => !n.isRead)
    return notifications.filter(n => n.type === type)
  }

  const filteredNotifications = filterNotifications(activeTab)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2">{unreadCount}</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">
              Stay updated with your SwapIt activity
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="swap_request">
            Swaps
          </TabsTrigger>
          <TabsTrigger value="message">
            Messages
          </TabsTrigger>
          <TabsTrigger value="item_boosted">
            Boosts
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length > 0 ? (
            <>
              {/* Clear All Button */}
              {notifications.length > 0 && (
                <div className="flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearAllNotifications}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              )}

              {/* Notifications List */}
              <div className="space-y-2">
                {filteredNotifications.map((notification, index) => (
                  <div key={notification.id}>
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        !notification.isRead ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Icon */}
                          <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className={`font-medium ${!notification.isRead ? 'text-primary' : ''}`}>
                                {notification.title}
                              </h4>
                              <div className="flex items-center gap-2 ml-4">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                  {formatTimeAgo(notification.createdAt)}
                                </span>
                                {!notification.isRead && (
                                  <div className="h-2 w-2 bg-primary rounded-full" />
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.content}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleNotificationClick(notification)
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {index < filteredNotifications.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Empty State */
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">
                  {activeTab === 'unread' ? 'No unread notifications' : 'No notifications'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {activeTab === 'unread' 
                    ? 'All caught up! You have no unread notifications.'
                    : 'When you receive notifications about swaps, messages, and activity, they\'ll appear here.'
                  }
                </p>
                {activeTab !== 'all' && (
                  <Button variant="outline" onClick={() => setActiveTab('all')}>
                    View All Notifications
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Notification Settings Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Notification Preferences</h3>
              <p className="text-sm text-muted-foreground">
                Manage how you receive notifications about your SwapIt activity
              </p>
            </div>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}