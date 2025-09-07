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

  return (
    <AnimatePresence>
      {isOpen && (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent 
            side="right" 
            className="w-[600px] p-0 overflow-hidden"
            as={motion.div}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <SheetHeader className="p-6 border-b border-gray-200 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(lead.firstName)}`}>
                    {lead.avatar}
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-semibold text-gray-900">
                      {lead.firstName} {lead.lastName}
                    </SheetTitle>
                    <p className="text-gray-600 mt-1">{lead.title}</p>
                    <p className="text-gray-500 text-sm">{lead.company}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-4">
                {getStatusBadge(lead.status)}
                <span className="text-sm text-gray-500">
                  Last contacted {formatDate(lead.lastContacted)}
                </span>
              </div>
            </SheetHeader>

            {/* Tabs */}
            <div className="border-b border-gray-200 bg-white">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('conversation')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'conversation'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Conversation
                </button>
                <button
                  onClick={() => setActiveTab('activity')}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'activity'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Activity
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {activeTab === 'overview' && (
                <div className="p-6 space-y-6">
                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3">
                      <Button className="justify-start" variant="outline">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button className="justify-start" variant="outline">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View LinkedIn
                      </Button>
                      <Button className="justify-start" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Follow-up
                      </Button>
                      <Button className="justify-start" variant="outline">
                        <Star className="h-4 w-4 mr-2" />
                        Add to Favorites
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Lead Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lead Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">Full Name</label>
                          <p className="text-gray-900 font-medium">{lead.firstName} {lead.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Email</label>
                          <p className="text-gray-900">{lead.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Company</label>
                          <p className="text-gray-900">{lead.company}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">Title</label>
                          <p className="text-gray-900">{lead.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Campaign Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Campaign Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{lead.campaignName}</p>
                          <p className="text-sm text-gray-500">Active campaign</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Textarea 
                        placeholder="Add a note about this lead..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={3}
                      />
                      <Button size="sm" disabled={!newNote.trim()}>
                        Add Note
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'conversation' && (
                <div className="p-6">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div key={message.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">
                              {message.type === 'connection_request' ? 'Connection Request' :
                               message.type === 'connection_accepted' ? 'Connection Accepted' : 'Message'}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Message Composer */}
                  <div className="mt-6 bg-white p-4 rounded-lg border border-gray-200">
                    <Textarea 
                      placeholder="Type your message..."
                      rows={3}
                    />
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-gray-500">Messages will be sent via LinkedIn</span>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'activity' && (
                <div className="p-6">
                  <div className="space-y-4">
                    {mockActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-200">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </AnimatePresence>
  )
}
