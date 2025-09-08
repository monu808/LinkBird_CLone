'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
  Loader2,
  Eye,
  Filter,
  Search,
  Power
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
  
  // Settings form state
  const [campaignName, setCampaignName] = useState('')
  const [campaignStatus, setCampaignStatus] = useState('active')
  const [autopilotMode, setAutopilotMode] = useState(false)
  
  // Mock leads data for this campaign
  const mockCampaignLeads = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@company.com',
      jobTitle: 'Marketing Director',
      company: 'TechCorp Inc.',
      status: 'contacted',
      lastContacted: '2025-09-07T10:30:00Z',
      responseRate: '15%'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@startup.io',
      jobTitle: 'CEO',
      company: 'StartupIO',
      status: 'responded',
      lastContacted: '2025-09-06T14:20:00Z',
      responseRate: '25%'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.wilson@enterprise.com',
      jobTitle: 'Sales Manager',
      company: 'Enterprise Solutions',
      status: 'converted',
      lastContacted: '2025-09-05T09:15:00Z',
      responseRate: '30%'
    },
    {
      id: 4,
      name: 'Lisa Chen',
      email: 'lisa.chen@techfirm.com',
      jobTitle: 'Product Manager',
      company: 'TechFirm',
      status: 'pending',
      lastContacted: null,
      responseRate: '0%'
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david@consulting.com',
      jobTitle: 'Consultant',
      company: 'Brown Consulting',
      status: 'contacted',
      lastContacted: '2025-09-08T08:45:00Z',
      responseRate: '12%'
    }
  ]

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
      
      // Initialize form fields
      setCampaignName(result.name || '')
      setCampaignStatus(result.status || 'active')
      setAutopilotMode(false) // Default value
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
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['overview', 'leads', 'sequence', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm capitalize`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
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
            <div className="space-y-6">
              {/* Leads Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Leads</p>
                      <p className="text-2xl font-bold text-gray-900">{mockCampaignLeads.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Contacted</p>
                      <p className="text-2xl font-bold text-green-600">
                        {mockCampaignLeads.filter(lead => lead.status === 'contacted' || lead.status === 'responded' || lead.status === 'converted').length}
                      </p>
                    </div>
                    <Mail className="h-8 w-8 text-green-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Responded</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {mockCampaignLeads.filter(lead => lead.status === 'responded' || lead.status === 'converted').length}
                      </p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-purple-500" />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Converted</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {mockCampaignLeads.filter(lead => lead.status === 'converted').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-orange-500" />
                  </div>
                </Card>
              </div>

              {/* Leads Filters */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Search leads..." className="pl-10 w-64" />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <Button>
                  <Users className="h-4 w-4 mr-2" />
                  Add Leads
                </Button>
              </div>

              {/* Leads Table */}
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Contacted</TableHead>
                      <TableHead>Response Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCampaignLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.company}</TableCell>
                        <TableCell>{lead.jobTitle}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              lead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'responded' ? 'bg-green-100 text-green-800' :
                              lead.status === 'converted' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>{lead.responseRate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {activeTab === 'sequence' && (
            <div className="space-y-6">
              {/* Request Message Section */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Request Message</h4>
                <p className="text-sm text-gray-600 mb-4">Edit your request message here</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Message Template */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Template
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Design your message template using the available fields<br />
                      Use {`{{field_name}}`} to insert mapped fields from your Data
                    </p>
                    <Textarea 
                      placeholder="Type your message here..."
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                  
                  {/* Available Fields Sidebar */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">Available fields:</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Settings & Billing</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{fullName}}`}</span>
                            <span>Full Name</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Admin Panel</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{firstName}}`}</span>
                            <span>First Name</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Activity logs</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{lastName}}`}</span>
                            <span>Last Name</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">User logs</h6>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Message Sequence</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{jobTitle}}`}</span>
                            <span>Job Title</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">8</span>
                          <span className="font-medium">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Connection Message Section */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Connection Message</h4>
                <p className="text-sm text-gray-600 mb-4">Edit your connection message here</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Message Template */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message Template
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Design your connection message template using the available fields<br />
                      Use {`{{field_name}}`} to insert mapped fields from your Data
                    </p>
                    <Textarea 
                      placeholder="Type your connection message here..."
                      className="min-h-[200px] resize-none"
                    />
                  </div>
                  
                  {/* Available Fields Sidebar - Same as above */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">Available fields:</h5>
                    
                    <div className="space-y-3">
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Settings & Billing</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{fullName}}`}</span>
                            <span>Full Name</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Admin Panel</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{firstName}}`}</span>
                            <span>First Name</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Activity logs</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{lastName}}`}</span>
                            <span>Last Name</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">User logs</h6>
                      </div>
                      
                      <div>
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Message Sequence</h6>
                        <div className="space-y-1 text-xs text-gray-600">
                          <div className="flex items-center justify-between">
                            <span>{`{{jobTitle}}`}</span>
                            <span>Job Title</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium">8</span>
                          <span className="font-medium">0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Campaign Basic Settings */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Name
                      </label>
                      <Input 
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Enter campaign name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Status
                      </label>
                      <select 
                        value={campaignStatus}
                        onChange={(e) => setCampaignStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="draft">Draft</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign Description
                      </label>
                      <Textarea 
                        placeholder="Enter campaign description..."
                        className="min-h-[100px] resize-none"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Autopilot Settings */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Automation Settings</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900">Autopilot Mode</h5>
                      <p className="text-sm text-gray-600">
                        Let the system automatically manage LinkedIn account assignments and optimize outreach timing
                      </p>
                    </div>
                    <button
                      onClick={() => setAutopilotMode(!autopilotMode)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        autopilotMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          autopilotMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  {autopilotMode && (
                    <div className="ml-4 space-y-3 border-l-2 border-blue-200 pl-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Automatic account rotation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Smart timing optimization</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Response rate monitoring</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">Automatic follow-up scheduling</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* LinkedIn Account Management */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">LinkedIn Account Management</h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Connection Limit
                      </label>
                      <Input type="number" defaultValue="20" min="1" max="100" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daily Message Limit
                      </label>
                      <Input type="number" defaultValue="50" min="1" max="200" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Between Actions (minutes)
                      </label>
                      <Input type="number" defaultValue="15" min="5" max="60" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Hours
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="9-17">9:00 AM - 5:00 PM</option>
                        <option value="8-18">8:00 AM - 6:00 PM</option>
                        <option value="10-16">10:00 AM - 4:00 PM</option>
                        <option value="24h">24 Hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Advanced Settings */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900">Smart Reply Detection</h5>
                      <p className="text-sm text-gray-600">Automatically detect and categorize lead responses</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900">Auto-follow Up</h5>
                      <p className="text-sm text-gray-600">Automatically send follow-up messages based on templates</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-semibold text-gray-900">Lead Scoring</h5>
                      <p className="text-sm text-gray-600">Automatically score leads based on engagement and profile data</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6 transition-transform" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
