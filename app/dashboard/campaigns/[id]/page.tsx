'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { SegmentTabs } from '@/src/components/SegmentTabs'
import { PlaceholderCard } from '@/src/components/PlaceholderCard'
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'leads', label: 'Leads', icon: <Users className="h-4 w-4" /> },
    { id: 'sequence', label: 'Sequence', icon: <Calendar className="h-4 w-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> }
  ]

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6 px-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading campaign...</span>
        </div>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6 px-6">
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
    <div className="max-w-[1200px] mx-auto space-y-6 px-6">
      {/* Breadcrumb */}
      <div className="pt-6 pb-4 flex items-center space-x-2 text-sm text-gray-600">
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

      {/* Campaign Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{campaign.name}</h1>
            <p className="text-sm text-gray-600">Campaign created on {new Date(campaign.createdAt).toLocaleDateString()}</p>
          </div>
          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
            {campaign.status}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-md p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-xs font-medium text-gray-600">Total Leads</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{campaign.totalLeads}</div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-xs font-medium text-gray-600">Contacted</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{campaign.stats?.contacted || 0}</div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-xs font-medium text-gray-600">Converted</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{campaign.stats?.converted || 0}</div>
          </div>
          
          <div className="bg-gray-50 rounded-md p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="h-5 w-5 text-purple-500 mr-2" />
              <span className="text-xs font-medium text-gray-600">Replies</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{campaign.stats?.responded || 0}</div>
          </div>
        </div>

        {/* Segmented Tabs */}
        <div className="mt-4">
          <SegmentTabs 
            tabs={tabs}
            value={activeTab}
            onValueChange={setActiveTab}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-xl shadow p-6 -mt-2">
        {activeTab === 'overview' && (
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Campaign Overview</h3>
              <p className="text-sm text-gray-600">Campaign performance and analytics</p>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Campaign Leads</h3>
              <p className="text-sm text-gray-600">Total leads: {campaign.totalLeads}</p>
            </div>
            <Button>Save</Button>
          </div>
        )}

        {activeTab === 'sequence' && (
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Message Sequence</h3>
              <p className="text-sm text-gray-600">Configure your outreach sequence</p>
            </div>
            <Button>Save</Button>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Campaign Settings</h3>
              <p className="text-sm text-gray-600">Configure campaign parameters</p>
            </div>
            <Button>Save</Button>
          </div>
        )}

        {/* Content Area with Internal Scrolling */}
        <div className="h-[calc(100vh-320px)] overflow-auto rounded-md" aria-label="Content container">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Progress</h3>
                <div className="space-y-4">
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
              
              <Card className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Created:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Status:</span>
                    <Badge className="ml-2" variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">Response Rate:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">
                      {(campaign.stats?.contacted || 0) > 0 ? Math.round(((campaign.stats?.responded || 0) / campaign.stats.contacted) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'leads' && (
            <PlaceholderCard 
              title="Campaign Leads"
              description="Lead management functionality will be implemented here."
              statusText="Coming Soon"
              statusColor="blue"
            />
          )}

          {activeTab === 'sequence' && (
            <PlaceholderCard 
              title="Message Sequence"
              description="Campaign sequence management will be implemented here."
              statusText="In Development"
              statusColor="yellow"
            />
          )}

          {activeTab === 'settings' && (
            <PlaceholderCard 
              title="Campaign Settings"
              description="Campaign configuration options will be implemented here."
              statusText="Available"
              statusColor="green"
            />
          )}
        </div>
      </div>
    </div>
  )
}
