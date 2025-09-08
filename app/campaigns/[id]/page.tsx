'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import Sidebar from '@/components/layout/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'
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
  TrendingUp
} from 'lucide-react'

export default function CampaignDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params.id as string
  
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch campaign details
  const { data: campaign, isLoading, error } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => apiClient.campaigns.getById(campaignId),
    enabled: !!campaignId,
  })

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Sidebar>
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </Sidebar>
      </ProtectedRoute>
    )
  }

  if (error || !campaign) {
    return (
      <ProtectedRoute>
        <Sidebar>
          <div className="flex-1 flex items-center justify-center p-8">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Campaign not found</h2>
              <p className="text-gray-600 mb-4">The campaign you're looking for doesn't exist or has been deleted.</p>
              <Button onClick={() => router.push('/campaigns')}>
                Back to Campaigns
              </Button>
            </Card>
          </div>
        </Sidebar>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Sidebar>
        <div className="flex-1 overflow-auto">
          {/* Breadcrumb */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <button
                onClick={() => router.push('/campaigns')}
                className="hover:text-gray-900"
              >
                Campaign
              </button>
              <span>/</span>
              <span className="text-gray-900 font-medium">{campaign.name}</span>
            </div>
          </div>

          {/* Campaign Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Campaign Details</h1>
                <p className="text-gray-600">Manage and track your campaign performance</p>
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
                <div className="text-3xl font-bold text-gray-900">{campaign.totalLeads || 20}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Mail className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Request Sent</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{campaign.stats?.contacted || 0}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Request Accepted</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{campaign.stats?.converted || 0}</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <MessageSquare className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Request Replied</span>
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
          <div className="flex-1 p-6 bg-gray-50">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Progress</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Leads Contacted</span>
                          <span className="text-sm font-medium text-gray-900">0.0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ 
                              width: `${campaign.totalLeads ? Math.round((campaign.stats?.contacted || 0) / campaign.totalLeads * 100) : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Acceptance Rate</span>
                          <span className="text-sm font-medium text-gray-900">0.0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ 
                              width: `${campaign.stats?.contacted ? Math.round((campaign.stats?.converted || 0) / campaign.stats.contacted * 100) : 0}%` 
                            }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Reply Rate</span>
                          <span className="text-sm font-medium text-gray-900">0.0%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ 
                              width: `${campaign.stats?.contacted ? Math.round((campaign.stats?.responded || 0) / campaign.stats.contacted * 100) : 0}%` 
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
                        <span className="text-sm text-gray-600">Start Date:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">02/09/2025</span>
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
                        <span className="text-sm text-gray-600">Conversion Rate:</span>
                        <span className="ml-2 text-sm font-medium text-gray-900">0.0%</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="leads" className="mt-0">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Leads</h3>
                  <p className="text-gray-600">Lead management functionality will be implemented here.</p>
                </Card>
              </TabsContent>
              
              <TabsContent value="sequence" className="mt-0">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Sequence</h3>
                  <p className="text-gray-600">Campaign sequence management will be implemented here.</p>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h3>
                  <p className="text-gray-600">Campaign configuration options will be implemented here.</p>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </Sidebar>
    </ProtectedRoute>
  )
}