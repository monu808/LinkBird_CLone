'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  Eye,
  Loader2
} from 'lucide-react'

interface Campaign {
  id: number
  name: string
  status: string
  userId: string
  startDate: string
  createdAt: string
  updatedAt: string
  totalLeads: number
  stats: {
    contacted: number
    responded: number
    converted: number
  }
}

// Helper function for status badges
const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', label: 'Active' },
    paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
    draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
    inactive: { color: 'bg-red-100 text-red-800', label: 'Inactive' }
  }
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
  
  return (
    <Badge className={`${config.color} border-0`}>
      {config.label}
    </Badge>
  )
}

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch campaigns from API
  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      console.log('Fetching campaigns from API...')
      // Temporarily bypass user filter to see if there are any campaigns at all
      const response = await fetch('/api/campaigns?bypass_user_filter=true')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`Failed to fetch campaigns: ${response.status} ${errorText}`)
      }
      
      const result = await response.json()
      console.log('API Result:', result)
      setCampaigns(result.data || [])
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCampaignClick = (campaignId: number) => {
    console.log('Dashboard campaign clicked!', campaignId)
    router.push(`/dashboard/campaigns/${campaignId}`)
  }

  const handleRowClick = (campaign: Campaign, e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return
    }
    handleCampaignClick(campaign.id)
  }

  // Calculate totals from real data
  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalLeads = campaigns.reduce((sum, c) => sum + (c.totalLeads || 0), 0)
  const totalResponses = campaigns.reduce((sum, c) => sum + (c.stats?.responded || 0), 0)
  const responseRate = totalLeads > 0 ? ((totalResponses / totalLeads) * 100).toFixed(1) : '0.0'
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
                <p className="text-2xl font-bold text-gray-900">{totalCampaigns}</p>
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
                <p className="text-2xl font-bold text-gray-900">{activeCampaigns}</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalLeads.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">{responseRate}%</p>
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
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Loading campaigns...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Error loading campaigns: {error}</p>
              <Button onClick={fetchCampaigns} variant="outline">
                Try Again
              </Button>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No campaigns found</p>
              <Button onClick={() => router.push('/dashboard/campaigns/new')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Campaign Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Leads</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Contacted</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Replies</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Progress</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => {
                    const contacted = campaign.stats?.contacted || 0
                    const progress = campaign.totalLeads > 0 ? Math.round((contacted / campaign.totalLeads) * 100) : 0
                    const lastActivity = new Date(campaign.updatedAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })
                    
                    return (
                      <tr 
                        key={campaign.id} 
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => handleRowClick(campaign, e)}
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{campaign.name}</p>
                            <p className="text-sm text-gray-500">Last activity {lastActivity}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">{campaign.totalLeads}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-gray-900">{contacted}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-gray-900">{campaign.stats?.responded || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Progress value={progress} className="w-20" />
                            <span className="text-sm text-gray-600">{progress}% complete</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {getStatusBadge(campaign.status)}
                        </td>
                        <td className="py-4 px-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Add menu functionality here
                            }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
