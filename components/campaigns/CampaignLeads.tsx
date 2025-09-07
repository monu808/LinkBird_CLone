import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Search,
  Filter,
  Users,
  Mail,
  LinkedIn,
  MapPin,
  Building,
  User,
  MoreVertical,
  MessageSquare,
  UserPlus,
  Eye
} from 'lucide-react'

interface CampaignLeadsProps {
  campaignId: string
}

interface Lead {
  id: string
  name: string
  title: string
  company: string
  location: string
  profileUrl: string
  connectionDegree: string
  status: string
  lastActivity: string
  email?: string
  phone?: string
}

export function CampaignLeads({ campaignId }: CampaignLeadsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data: leads, isLoading } = useQuery({
    queryKey: ['campaign-leads', campaignId, searchQuery, statusFilter],
    queryFn: () => apiClient.campaigns.getLeads(campaignId, { 
      search: searchQuery, 
      status: statusFilter 
    }),
    enabled: !!campaignId,
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'contacted':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'replied':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getConnectionBadgeColor = (degree: string) => {
    switch (degree) {
      case '1st':
        return 'bg-blue-500'
      case '2nd':
        return 'bg-green-500'
      case '3rd':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Mock data if API doesn't return leads
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'John Smith',
      title: 'Senior Marketing Manager',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      profileUrl: 'https://linkedin.com/in/johnsmith',
      connectionDegree: '2nd',
      status: 'contacted',
      lastActivity: '2 days ago',
      email: 'john.smith@techcorp.com'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      title: 'VP of Sales',
      company: 'StartupXYZ',
      location: 'New York, NY',
      profileUrl: 'https://linkedin.com/in/sarahjohnson',
      connectionDegree: '1st',
      status: 'connected',
      lastActivity: '1 day ago',
      email: 'sarah@startupxyz.com'
    },
    {
      id: '3',
      name: 'Mike Davis',
      title: 'Product Director',
      company: 'Innovation Labs',
      location: 'Austin, TX',
      profileUrl: 'https://linkedin.com/in/mikedavis',
      connectionDegree: '3rd',
      status: 'pending',
      lastActivity: '5 days ago'
    }
  ]

  const displayLeads = leads?.data || mockLeads

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="animate-pulse flex items-center space-x-4">
              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Campaign Leads</h2>
          <p className="text-sm text-gray-600">
            {displayLeads.length} leads in this campaign
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Leads
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">20</div>
          <div className="text-sm text-gray-600">Total Leads</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">8</div>
          <div className="text-sm text-gray-600">Contacted</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600">Connected</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">1</div>
          <div className="text-sm text-gray-600">Replied</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">12</div>
          <div className="text-sm text-gray-600">Pending</div>
        </Card>
      </div>

      {/* Leads List */}
      <div className="space-y-4">
        {displayLeads.map((lead) => (
          <Card key={lead.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {lead.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${getConnectionBadgeColor(lead.connectionDegree)}`}></div>
                    <span className="text-xs font-medium text-gray-600">{lead.connectionDegree}</span>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {lead.title} at {lead.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {lead.location}
                    </div>
                    <div className="flex items-center">
                      <LinkedIn className="h-4 w-4 mr-1 text-blue-600" />
                      LinkedIn Profile
                    </div>
                  </div>
                  
                  {lead.email && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {lead.email}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Last activity</div>
                  <div className="text-sm font-medium text-gray-900">{lead.lastActivity}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {displayLeads.length > 0 && (
        <div className="text-center py-6">
          <Button variant="outline">
            Load More Leads
          </Button>
        </div>
      )}
    </div>
  )
}
