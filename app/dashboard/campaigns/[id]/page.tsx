'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { 
  Settings, 
  Users, 
  Mail, 
  BarChart3,
  Calendar,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
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

export default function CampaignDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = parseInt(params.id as string)
  
  const [activeTab, setActiveTab] = useState('overview')
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch campaign details from API
  useEffect(() => {
    if (campaignId) {
      fetchCampaign()
    }
  }, [campaignId])

  const fetchCampaign = async () => {
    try {
      setLoading(true)
      console.log('Fetching campaign details from demo API for ID:', campaignId)
      const response = await fetch(`/api/campaigns/demo/${campaignId}`)
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error:', errorText)
        throw new Error(`Failed to fetch campaign: ${response.status}`)
      }
      
      const result = await response.json()
      console.log('Campaign details result:', result)
      setCampaign(result)
    } catch (err) {
      console.error('Fetch campaign error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading campaign...</span>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error ? 'Error loading campaign' : 'Campaign not found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || "The campaign you're looking for doesn't exist."}
          </p>
          <Button onClick={() => router.push('/dashboard/campaigns')}>
            Back to Campaigns
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <button
          onClick={() => router.push('/dashboard/campaigns')}
          className="flex items-center hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Campaigns
        </button>
        <span>/</span>
        <span className="text-gray-900 font-medium">{campaign.name}</span>
      </div>

      {/* Campaign Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
            <p className="text-gray-600">Campaign created on {new Date(campaign.createdAt).toLocaleDateString()}</p>
          </div>
          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
            {campaign.status}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Users className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Total Leads</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{campaign.totalLeads}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Mail className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Contacted</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{campaign.stats?.contacted || 0}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Converted</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{campaign.stats?.converted || 0}</div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <MessageSquare className="h-6 w-6 text-blue-500 mr-2" />
              <span className="text-sm font-medium text-gray-600">Replies</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{campaign.stats?.responded || 0}</div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1">
            <TabsTrigger 
              value="overview" 
              className="flex items-center space-x-2 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leads" 
              className="flex items-center space-x-2 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Users className="h-4 w-4" />
              <span>Leads</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sequence" 
              className="flex items-center space-x-2 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Calendar className="h-4 w-4" />
              <span>Sequence</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center space-x-2 py-3 px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview" className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Progress</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Leads Contacted</span>
                      <span className="text-sm font-medium text-gray-900">
                        {campaign.totalLeads > 0 ? Math.round(((campaign.stats?.contacted || 0) / campaign.totalLeads) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ 
                          width: `${campaign.totalLeads > 0 ? Math.round(((campaign.stats?.contacted || 0) / campaign.totalLeads) * 100) : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(campaign.stats?.contacted || 0) > 0 ? Math.round(((campaign.stats?.responded || 0) / campaign.stats.contacted) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${(campaign.stats?.contacted || 0) > 0 ? Math.round(((campaign.stats?.responded || 0) / campaign.stats.contacted) * 100) : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Conversion Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(campaign.stats?.contacted || 0) > 0 ? Math.round(((campaign.stats?.converted || 0) / campaign.stats.contacted) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ 
                          width: `${(campaign.stats?.contacted || 0) > 0 ? Math.round(((campaign.stats?.converted || 0) / campaign.stats.contacted) * 100) : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className="ml-2" variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Response Rate:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {(campaign.stats?.contacted || 0) > 0 ? Math.round(((campaign.stats?.responded || 0) / campaign.stats.contacted) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="leads" className="p-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Leads</h3>
              <p className="text-gray-600">Total leads: {campaign.leads}</p>
              <p className="text-gray-600 mt-2">Lead management functionality will be implemented here.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="sequence" className="p-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Sequence</h3>
              <p className="text-gray-600">Campaign sequence management will be implemented here.</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="p-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h3>
              <p className="text-gray-600">Campaign configuration options will be implemented here.</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
