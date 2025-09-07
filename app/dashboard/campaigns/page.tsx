'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Eye
} from 'lucide-react'

// Mock campaigns data
const mockCampaigns = [
  {
    id: 1,
    name: 'Product Manager Outreach Q4',
    leads: 245,
    connections: 89,
    replies: 23,
    progress: 78,
    status: 'active',
    lastActivity: 'Jan 6, 05:00 PM'
  },
  {
    id: 2,
    name: 'Engineering Leaders Campaign',
    leads: 180,
    connections: 65,
    replies: 18,
    progress: 65,
    status: 'active',
    lastActivity: 'Jan 6, 02:45 PM'
  },
  {
    id: 3,
    name: 'Startup Founders Network',
    leads: 320,
    connections: 156,
    replies: 45,
    progress: 92,
    status: 'paused',
    lastActivity: 'Jan 5, 09:50 PM'
  },
  {
    id: 4,
    name: 'Sales Leaders Q1',
    leads: 0,
    connections: 0,
    replies: 0,
    progress: 0,
    status: 'draft',
    lastActivity: 'Jan 7, 07:40 PM'
  }
]

export default function CampaignsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <p className="text-gray-600">Create and manage your outreach campaigns</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
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
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Play className="h-6 w-6 text-green-600" />
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
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-gray-900">23.4%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button className="px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-md shadow-sm">
            All
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
            Active
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
            Paused
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">
            Completed
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search campaigns..." 
              className="pl-10 w-80"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Campaigns Table */}
      <Card className="bg-white rounded-xl shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaigns</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Campaign Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Leads</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Connections</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Replies</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Progress</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {mockCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{campaign.name}</p>
                        <p className="text-sm text-gray-500">Last activity {campaign.lastActivity}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{campaign.leads}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-gray-900">{campaign.connections}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-gray-900">{campaign.replies}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={campaign.progress} className="w-20" />
                        <span className="text-sm text-gray-600">{campaign.progress}% complete</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(campaign.status)}
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
