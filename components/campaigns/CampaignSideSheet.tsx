import { useQuery } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { useUIStore } from '@/stores/uiStore'
import { apiClient } from '@/lib/api-client'
import { 
  Calendar, 
  Users, 
  Mail, 
  Settings,
  BarChart3,
  CheckCircle,
  MessageSquare,
  X,
  TrendingUp
} from 'lucide-react'
import { useState } from 'react'

export function CampaignSideSheet() {
  const { 
    selectedCampaignId, 
    isCampaignSheetOpen, 
    closeCampaignSheet 
  } = useUIStore()
  
  const [activeTab, setActiveTab] = useState('overview')

  // Fetch campaign details
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', selectedCampaignId],
    queryFn: () => selectedCampaignId ? apiClient.campaigns.getById(selectedCampaignId.toString()) : null,
    enabled: !!selectedCampaignId,
  })

  if (!campaign && !isLoading) {
    return null
  }

  return (
    <Sheet open={isCampaignSheetOpen} onOpenChange={closeCampaignSheet}>
      <SheetContent className="w-[800px] sm:max-w-[800px] p-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : campaign ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
                    <p className="text-sm text-gray-600">Manage and track your campaign performance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                    {campaign.status}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={closeCampaignSheet}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Total Leads</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{campaign.totalLeads || 20}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Mail className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Request Sent</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{campaign.stats?.contacted || 0}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <CheckCircle className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Request Accepted</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{campaign.stats?.converted || 0}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Request Replied</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{campaign.stats?.responded || 0}</div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1">
                  <TabsTrigger 
                    value="overview" 
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="leads" 
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span>Leads</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="sequence" 
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Sequence</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="overview" className="p-6 mt-0">
                  <div className="space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Progress</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Leads Contacted</span>
                            <span className="text-sm font-medium text-gray-900">
                              {campaign.stats?.contacted || 0} of {campaign.totalLeads || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ 
                                width: `${campaign.totalLeads ? Math.round((campaign.stats?.contacted || 0) / campaign.totalLeads * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {campaign.totalLeads ? Math.round((campaign.stats?.contacted || 0) / campaign.totalLeads * 100) : 0}%
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Acceptance Rate</span>
                            <span className="text-sm font-medium text-gray-900">
                              {campaign.stats?.contacted ? Math.round((campaign.stats?.converted || 0) / campaign.stats.contacted * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ 
                                width: `${campaign.stats?.contacted ? Math.round((campaign.stats?.converted || 0) / campaign.stats.contacted * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {campaign.stats?.contacted ? Math.round((campaign.stats?.converted || 0) / campaign.stats.contacted * 100) : 0}%
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Reply Rate</span>
                            <span className="text-sm font-medium text-gray-900">
                              {campaign.stats?.contacted ? Math.round((campaign.stats?.responded || 0) / campaign.stats.contacted * 100) : 0}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ 
                                width: `${campaign.stats?.contacted ? Math.round((campaign.stats?.responded || 0) / campaign.stats.contacted * 100) : 0}%` 
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {campaign.stats?.contacted ? Math.round((campaign.stats?.responded || 0) / campaign.stats.contacted * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    </Card>
                    
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-sm text-gray-600">Start Date:</span>
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '02/09/2025'}
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
                          <span className="text-sm text-gray-600">Conversion Rate:</span>
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {campaign.conversionRate ? `${campaign.conversionRate}%` : '0.0%'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="leads" className="p-6 mt-0">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Leads</h3>
                    <p className="text-gray-600">Lead management functionality will be implemented here.</p>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sequence" className="p-6 mt-0">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Sequence</h3>
                    <p className="text-gray-600">Campaign sequence management will be implemented here.</p>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="p-6 mt-0">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h3>
                    <p className="text-gray-600">Campaign configuration options will be implemented here.</p>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Campaign not found
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
