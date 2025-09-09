'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  Megaphone, 
  TrendingUp, 
  Mail,
  Target,
  MoreHorizontal,
  Check,
  Clock,
  Eye
} from 'lucide-react'

// Mock data for recent activity
const mockActivity = [
  {
    id: 1,
    name: 'Sarah Johnson',
    campaign: 'Product Manager Outreach Q4',
    status: 'Connected',
    statusType: 'success',
    time: 'Jan 6, 2025',
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Michael Chen',
    campaign: 'Engineering Leaders Campaign',
    status: 'Sent',
    statusType: 'sent',
    time: 'Jan 6, 2025',
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    campaign: 'Startup Founders Network',
    status: 'Replied',
    statusType: 'replied',
    time: 'Jan 5, 2025',
    avatar: 'ER'
  },
  {
    id: 4,
    name: 'David Kim',
    campaign: 'Sales Leaders Q1',
    status: 'Pending Approval',
    statusType: 'pending',
    time: 'Jan 6, 2025',
    avatar: 'DK'
  }
]

export default function DashboardPage() {
  // Fetch campaigns from API
  const { data: campaignsResponse, isLoading: campaignsLoading, error: campaignsError } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiClient.campaigns.list({ page: 1, limit: 10 }),
  })

  const campaigns = campaignsResponse?.data || []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">inactive</Badge>
      case 'draft':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getActivityStatusBadge = (status: string, type: string) => {
    switch (type) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Connected</Badge>
      case 'sent':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Sent 7 mins ago</Badge>
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

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">1,357</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connection Rate</p>
                <p className="text-2xl font-bold text-gray-900">34.7%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">489</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Active Campaigns</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[calc(100vh-350px)] overflow-auto rounded-md space-y-4" aria-label="Active campaigns container">
              {campaignsLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading campaigns...</p>
                </div>
              ) : campaignsError ? (
                <div className="text-center py-4">
                  <p className="text-red-500">Error loading campaigns: {campaignsError.message}</p>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No campaigns found</p>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Megaphone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-sm text-gray-500">{campaign.totalLeads || 0} leads • {campaign.stats?.contacted || 0} sent</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(campaign.status)}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[calc(100vh-350px)] overflow-auto rounded-md space-y-4" aria-label="Recent activity container">
              {mockActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(activity.name)}`}>
                      {activity.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.name}</p>
                      <p className="text-sm text-gray-500">{activity.campaign}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getActivityStatusBadge(activity.status, activity.statusType)}
                    <div className="flex items-center">
                      {activity.statusType === 'success' && <Check className="h-4 w-4 text-green-500" />}
                      {activity.statusType === 'replied' && <Eye className="h-4 w-4 text-blue-500" />}
                      {activity.statusType === 'pending' && <Clock className="h-4 w-4 text-purple-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
