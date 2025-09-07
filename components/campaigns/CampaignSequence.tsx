import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Plus,
  Edit,
  Trash2,
  Clock,
  Send,
  MessageSquare,
  Users,
  PlayCircle,
  PauseCircle,
  Copy,
  MoreVertical
} from 'lucide-react'

interface CampaignSequenceProps {
  campaignId: string
}

interface SequenceStep {
  id: string
  type: 'connection' | 'message' | 'follow_up'
  title: string
  content: string
  delayDays: number
  delayHours: number
  isActive: boolean
  sentCount: number
  responseCount: number
  order: number
}

export function CampaignSequence({ campaignId }: CampaignSequenceProps) {
  const [selectedStep, setSelectedStep] = useState<string | null>(null)

  const { data: sequence, isLoading } = useQuery({
    queryKey: ['campaign-sequence', campaignId],
    queryFn: () => apiClient.campaigns.getSequence(campaignId),
    enabled: !!campaignId,
  })

  // Mock sequence data
  const mockSequence: SequenceStep[] = [
    {
      id: '1',
      type: 'connection',
      title: 'Initial Connection Request',
      content: 'Hi {{firstName}}, I came across your profile and was impressed by your experience in {{industry}}. I\'d love to connect and share some insights about {{topic}}.',
      delayDays: 0,
      delayHours: 0,
      isActive: true,
      sentCount: 20,
      responseCount: 8,
      order: 1
    },
    {
      id: '2',
      type: 'follow_up',
      title: 'Follow-up Message',
      content: 'Hi {{firstName}}, thanks for connecting! I wanted to follow up on my previous message about {{topic}}. Would you be interested in a quick 15-minute call to discuss this further?',
      delayDays: 3,
      delayHours: 0,
      isActive: true,
      sentCount: 8,
      responseCount: 3,
      order: 2
    },
    {
      id: '3',
      type: 'message',
      title: 'Value-add Message',
      content: 'Hi {{firstName}}, I thought you might find this article interesting: {{articleLink}}. It discusses some trends in {{industry}} that align with what we talked about.',
      delayDays: 7,
      delayHours: 0,
      isActive: false,
      sentCount: 0,
      responseCount: 0,
      order: 3
    }
  ]

  const displaySequence = sequence?.data || mockSequence

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'connection':
        return <Users className="h-5 w-5 text-blue-500" />
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />
      case 'follow_up':
        return <Send className="h-5 w-5 text-purple-500" />
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />
    }
  }

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'connection':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'message':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'follow_up':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDelay = (days: number, hours: number) => {
    if (days === 0 && hours === 0) return 'Immediately'
    if (days === 0) return `${hours} hour${hours !== 1 ? 's' : ''}`
    if (hours === 0) return `${days} day${days !== 1 ? 's' : ''}`
    return `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Message Sequence</h2>
          <p className="text-sm text-gray-600">
            Manage your automated message sequence for this campaign
          </p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>

      {/* Sequence Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{displaySequence.length}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {displaySequence.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Steps</div>
            </div>
            <PlayCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {displaySequence.reduce((sum, s) => sum + s.sentCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Messages Sent</div>
            </div>
            <Send className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {displaySequence.reduce((sum, s) => sum + s.responseCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Responses</div>
            </div>
            <MessageSquare className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Sequence Steps */}
      <div className="space-y-6">
        {displaySequence.map((step, index) => (
          <Card key={step.id} className="overflow-hidden">
            <div className="p-6">
              {/* Step Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
                    {step.order}
                  </div>
                  {getStepTypeIcon(step.type)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <Badge className={getStepTypeColor(step.type)}>
                        {step.type.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {index === 0 ? 'Immediately' : `After ${formatDelay(step.delayDays, step.delayHours)}`}
                      </div>
                      {step.isActive ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Step Content */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{step.content}</p>
              </div>

              {/* Step Performance */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{step.sentCount}</div>
                  <div className="text-xs text-gray-600">Sent</div>
                </div>
                
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{step.responseCount}</div>
                  <div className="text-xs text-gray-600">Responses</div>
                </div>
                
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">
                    {step.sentCount > 0 ? Math.round((step.responseCount / step.sentCount) * 100) : 0}%
                  </div>
                  <div className="text-xs text-gray-600">Response Rate</div>
                </div>
              </div>
            </div>

            {/* Connection Line */}
            {index < displaySequence.length - 1 && (
              <div className="flex justify-center">
                <div className="w-px h-8 bg-gray-200"></div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Add New Step Button */}
      <Card className="p-8 border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Add New Step</h3>
          <p className="text-gray-600 mb-4">
            Create a new message or action in your sequence
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>
      </Card>
    </div>
  )
}
