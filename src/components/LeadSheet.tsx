'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  X, 
  Mail, 
  MessageSquare, 
  Phone, 
  ExternalLink, 
  Calendar,
  User,
  Building2,
  Clock,
  Activity,
  Send,
  Star,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Lead {
  id: number
  firstName: string
  lastName: string
  title: string
  company: string
  email: string
  campaignName: string
  status: string
  lastContacted: string
  avatar: string
}

interface LeadSheetProps {
  lead: Lead
  isOpen: boolean
  onClose: () => void
}

export function LeadSheet({ lead, isOpen, onClose }: LeadSheetProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [newNote, setNewNote] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
      case 'sent':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Sent</Badge>
      case 'replied':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Replied</Badge>
      case 'pending':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Pending Approval</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  // Mock conversation data
  const mockMessages = [
    {
      id: 1,
      type: 'connection_request',
      content: "Hi Sarah! I saw your work at TechCorp and I'm impressed by your product management approach. I'd love to connect and potentially explore collaboration opportunities.",
      timestamp: '2025-01-05T09:00:00Z',
      status: 'sent'
    },
    {
      id: 2,
      type: 'connection_accepted',
      content: 'Connection request accepted',
      timestamp: '2025-01-05T14:30:00Z',
      status: 'received'
    },
    {
      id: 3,
      type: 'message',
      content: "Thanks for connecting! I'd be happy to chat about product management strategies. What specific areas are you working on?",
      timestamp: '2025-01-05T15:15:00Z',
      status: 'received'
    }
  ]

  // Mock activity data
  const mockActivity = [
    { action: 'Viewed profile', timestamp: '2025-01-06T10:30:00Z' },
    { action: 'Sent message', timestamp: '2025-01-05T15:15:00Z' },
    { action: 'Connection accepted', timestamp: '2025-01-05T14:30:00Z' },
    { action: 'Connection request sent', timestamp: '2025-01-05T09:00:00Z' },
    { action: 'Added to campaign', timestamp: '2025-01-04T16:20:00Z' }
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
    if (status === 'failed') return `${type} failed`
    
    switch (type) {
      case 'invitation':
        return 'Invitation sent'
      case 'connection':
        return 'Connection accepted'
      case 'message':
        return 'Message sent'
      case 'follow_up':
        return 'Follow-up sent'
      case 'reply':
        return 'Replied to message'
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start space-x-3"
        >
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white',
            activity.status === 'failed' ? 'border-red-200' : 'border-gray-200'
          )}>
            {getActivityIcon(activity.type, activity.status)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">
                {getActivityTitle(activity.type, activity.status)}
              </p>
              <time className="text-xs text-gray-500">
                {formatRelativeTime(activity.date)}
              </time>
            </div>
            {activity.message && (
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 rounded-md p-2">
                {activity.message}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {formatDateTime(activity.date)}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export function LeadSheet() {
  const { selectedLeadId, leadSheetOpen, closeLeadSheet } = useUIStore()
  const { data: lead, isLoading } = useLead(selectedLeadId)
  const sheetRef = useRef<HTMLDivElement>(null)

  // Handle escape key and click outside
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeLeadSheet()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        closeLeadSheet()
      }
    }

    if (leadSheetOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      // Trap focus
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [leadSheetOpen, closeLeadSheet])

  if (!lead && !isLoading) return null

  const initials = lead ? getInitials(lead.firstName, lead.lastName) : '??'
  const avatarColor = lead ? getAvatarColor(lead.firstName + lead.lastName) : 'bg-gray-500'

  return (
    <AnimatePresence>
      {leadSheetOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto focus:outline-none"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
          >
            {isLoading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : lead ? (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'h-12 w-12 rounded-full flex items-center justify-center text-white font-medium',
                      avatarColor
                    )}>
                      {initials}
                    </div>
                    <div>
                      <h2 id="sheet-title" className="text-lg font-semibold text-gray-900">
                        {lead.firstName} {lead.lastName}
                      </h2>
                      <p className="text-sm text-gray-600">{lead.title}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeLeadSheet}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Status and Campaign */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={cn('border', getStatusColor(lead.status))}
                    >
                      {getStatusText(lead.status)}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Change Status
                    </Button>
                  </div>
                  
                  <Card className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {lead.campaignName}
                        </p>
                        <p className="text-xs text-gray-500">Campaign</p>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Active
                      </Badge>
                    </div>
                  </Card>
                </div>

                {/* Contact Information */}
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{lead.email}</p>
                        <p className="text-xs text-gray-500">Email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Building className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-900">{lead.company}</p>
                        <p className="text-xs text-gray-500">Company</p>
                      </div>
                    </div>
                    
                    {lead.location && (
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900">{lead.location}</p>
                          <p className="text-xs text-gray-500">Location</p>
                        </div>
                      </div>
                    )}
                    
                    {lead.linkedin && (
                      <div className="flex items-center space-x-3">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <div>
                          <Button
                            variant="link"
                            className="h-auto p-0 text-sm text-blue-600"
                            onClick={() => window.open(lead.linkedin, '_blank')}
                          >
                            View LinkedIn Profile
                          </Button>
                          <p className="text-xs text-gray-500">LinkedIn</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Activity Timeline */}
                <Card className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Activity Timeline</h3>
                  {lead.activities.length > 0 ? (
                    <ActivityTimeline activities={lead.activities} />
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No activity yet</p>
                    </div>
                  )}
                </Card>

                {/* Performance Metrics */}
                {lead.responseRate !== undefined && (
                  <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Performance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Response Rate</span>
                        <span className="text-sm font-medium">{lead.responseRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${lead.responseRate}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="space-y-2 pt-4 border-t">
                  <Button className="w-full" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add to Campaign
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Lead not found
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
