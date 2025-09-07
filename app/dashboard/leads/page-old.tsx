'use client'

import { useState, useEffect, useMemo } from 'react'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Search, Filter, Users, Mail, Building, Calendar, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { apiClient, useLeads } from '@/lib/api-client'
import { Lead } from '@/lib/types/api'

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-purple-100 text-purple-800'
    case 'contacted':
      return 'bg-orange-100 text-orange-800'
    case 'responded':
      return 'bg-blue-100 text-blue-800'
    case 'converted':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return Clock
    case 'contacted':
      return Mail
    case 'responded':
      return CheckCircle
    case 'converted':
      return CheckCircle
    case 'rejected':
      return XCircle
    default:
      return Clock
  }
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const { selectedLead, setSelectedLead, leadDetailOpen, setLeadDetailOpen } = useAppStore()
  
  // Fetch leads with React Query infinite query for pagination
  const {
    data: leadsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['leads', { search: searchQuery, status: statusFilter, campaignId: campaignFilter }],
    queryFn: ({ pageParam = 1 }) => apiClient.leads.list({
      page: pageParam,
      limit: 10,
      search: searchQuery || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      campaignId: campaignFilter !== 'all' ? parseInt(campaignFilter) : undefined,
    }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination
      return page < pages ? page + 1 : undefined
    },
    initialPageParam: 1,
  })

  // Fetch campaigns for filter dropdown
  const { data: campaignsData } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiClient.campaigns.list({ limit: 100 }),
  })

  // Flatten leads data from all pages
  const allLeads = useMemo(() => {
    return leadsData?.pages.flatMap(page => page.data) ?? []
  }, [leadsData])

  // Handle lead selection
  const handleLeadSelect = (lead: Lead) => {
    setSelectedLead(lead)
    setLeadDetailOpen(true)
  }

  // Stats calculations
  const totalLeads = leadsData?.pages[0]?.pagination.total ?? 0
  const pendingCount = allLeads.filter(lead => lead.status === 'pending').length
  const contactedCount = allLeads.filter(lead => lead.status === 'contacted').length
  const respondedCount = allLeads.filter(lead => lead.status === 'responded').length
  const convertedCount = allLeads.filter(lead => lead.status === 'converted').length

  // Auto-load more when reaching the end
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Error loading leads: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage and track your potential customers</p>
        </div>
        <Button>
          Add New Lead
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-2xl font-bold">{totalLeads}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-purple-600">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Contacted</p>
                <p className="text-2xl font-bold text-orange-600">{contactedCount}</p>
              </div>
              <Mail className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Responded</p>
                <p className="text-2xl font-bold text-blue-600">{respondedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Converted</p>
                <p className="text-2xl font-bold text-green-600">{convertedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search leads by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="responded">Responded</option>
          <option value="converted">Converted</option>
          <option value="rejected">Rejected</option>
        </select>
        
        <select
          value={campaignFilter}
          onChange={(e) => setCampaignFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Campaigns</option>
          {campaignsData?.data.map((campaign) => (
            <option key={campaign.id} value={campaign.id.toString()}>
              {campaign.name}
            </option>
          ))}
        </select>
        
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          More Filters
        </Button>
      </div>

      {/* Leads Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Loading leads...</span>
        </div>
      ) : allLeads.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' || campaignFilter !== 'all'
                ? "Try adjusting your search criteria or filters."
                : "Start by adding your first lead to begin building your pipeline."
              }
            </p>
            <Button>Add Your First Lead</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {allLeads.map((lead) => {
            const StatusIcon = getStatusIcon(lead.status)
            
            return (
              <Card
                key={lead.id}
                className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500"
                onClick={() => handleLeadSelect(lead)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {lead.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          {lead.email}
                        </div>
                        
                        {lead.company && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="w-4 h-4 mr-2" />
                            {lead.position ? `${lead.position} at ${lead.company}` : lead.company}
                          </div>
                        )}
                        
                        {lead.notes && (
                          <p className="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg">
                            {lead.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-500 ml-6">
                      <div className="flex items-center mb-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        Added {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                      
                      {lead.lastContactDate && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          Last contact: {new Date(lead.lastContactDate).toLocaleDateString()}
                        </div>
                      )}
                      
                      {lead.responseDate && (
                        <div className="flex items-center text-green-600 mt-1">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Responded: {new Date(lead.responseDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          {/* Load More Indicator */}
          {isFetchingNextPage && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span className="text-gray-600">Loading more leads...</span>
            </div>
          )}
          
          {!hasNextPage && allLeads.length > 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>You've reached the end of your leads list.</p>
            </div>
          )}
        </div>
      )}

      {/* Lead Detail Sheet */}
      <Sheet open={leadDetailOpen} onOpenChange={setLeadDetailOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Lead Details</SheetTitle>
            <SheetDescription>
              View and manage lead information
            </SheetDescription>
          </SheetHeader>
          
          {selectedLead && (
            <div className="mt-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedLead.firstName} {selectedLead.lastName}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedLead.email}</p>
                </div>
                
                {selectedLead.company && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Company</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.company}</p>
                  </div>
                )}
                
                {selectedLead.position && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Position</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedLead.position}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Added Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedLead.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {selectedLead.lastContactDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Contact</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedLead.lastContactDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {selectedLead.responseDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Response Date</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedLead.responseDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                
                {selectedLead.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900 p-3 bg-gray-50 rounded-lg">
                      {selectedLead.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-6 border-t">
                <Button className="flex-1">Edit Lead</Button>
                <Button variant="outline" className="flex-1">Contact Lead</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Mock data - in a real app, this would come from your API
const mockLeads = [
  {
    id: 1,
    firstName: 'Om',
    lastName: 'Satyarthy',
    email: 'om.satyarthy@company.com',
    company: 'Regional Corp',
    position: 'Regional Head',
    status: 'pending',
    campaignName: 'Gynoveda',
    lastContactDate: '2024-09-06',
    responseDate: null,
    notes: 'Potential high-value client. Very interested in our services.',
  },
  {
    id: 2,
    firstName: 'Dr. Bhuvaneshwari',
    lastName: 'Patel',
    email: 'dr.bhuvani@healthcorp.com',
    company: 'HealthCorp',
    position: 'Fertility & Women\'s Health Specialist',
    status: 'contacted',
    campaignName: 'Gynoveda',
    lastContactDate: '2024-09-06',
    responseDate: null,
    notes: 'Sent initial message 7 minutes ago.',
  },
  {
    id: 3,
    firstName: 'Surdeep',
    lastName: 'Singh',
    email: 'surdeep@growthhub.com',
    company: 'Growth Hub',
    position: 'Building Product-led SEO Growth',
    status: 'contacted',
    campaignName: 'Gynoveda',
    lastContactDate: '2024-09-06',
    responseDate: null,
    notes: 'Reached out via LinkedIn. Waiting for response.',
  },
  {
    id: 4,
    firstName: 'Dilbag',
    lastName: 'Singh',
    email: 'dilbag@marketingpro.com',
    company: 'Marketing Pro',
    position: 'Manager Marketing & Communication',
    status: 'contacted',
    campaignName: 'Gynoveda',
    lastContactDate: '2024-09-06',
    responseDate: null,
    notes: 'Sent connection request and intro message.',
  },
  {
    id: 5,
    firstName: 'Vanshy',
    lastName: 'Jain',
    email: 'vanshy@ayurveda.com',
    company: 'Ayurveda Solutions',
    position: 'Ayurveda | Primary Infertility',
    status: 'contacted',
    campaignName: 'Gynoveda',
    lastContactDate: '2024-09-06',
    responseDate: null,
    notes: 'Perfect fit for our ayurvedic products.',
  },
  {
    id: 6,
    firstName: 'Sunil',
    lastName: 'Pal',
    email: 'sunil@fashionbrand.com',
    company: 'Fashion Brand',
    position: 'Helping Fashion & Lifestyle Brands',
    status: 'pending',
    campaignName: 'Digi Sidekick',
    lastContactDate: null,
    responseDate: null,
    notes: 'New lead from fashion industry campaign.',
  },
  {
    id: 7,
    firstName: 'Utkarsh',
    lastName: 'K.',
    email: 'utkarsh@skincare.com',
    company: 'SkinCare Co',
    position: 'Airbnb Host | Ex-The Skin Story',
    status: 'responded',
    campaignName: 'The Skin Story',
    lastContactDate: '2024-09-05',
    responseDate: '2024-09-06',
    notes: 'Responded positively! Interested in partnership.',
  },
  {
    id: 8,
    firstName: 'Shreya',
    lastName: 'Ramakrishna',
    email: 'shreya@startup.com',
    company: 'Startup Inc',
    position: 'Deputy Manager - Founder\'s Office',
    status: 'responded',
    campaignName: 'Pokonut',
    lastContactDate: '2024-09-05',
    responseDate: '2024-09-06',
    notes: 'Very interested! Scheduled a follow-up call.',
  },
  {
    id: 9,
    firstName: 'Deepak',
    lastName: 'Kumar',
    email: 'deepak@adagency.com',
    company: 'Ad Agency',
    position: 'Deputy Manager Advertising',
    status: 'responded',
    campaignName: 'Re\'equil',
    lastContactDate: '2024-09-04',
    responseDate: '2024-09-05',
    notes: 'Interested in skincare collaboration.',
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-purple-100 text-purple-800'
    case 'contacted':
      return 'bg-orange-100 text-orange-800'
    case 'responded':
      return 'bg-blue-100 text-blue-800'
    case 'converted':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-3 w-3" />
    case 'contacted':
      return <Mail className="h-3 w-3" />
    case 'responded':
      return <CheckCircle className="h-3 w-3" />
    case 'converted':
      return <CheckCircle className="h-3 w-3" />
    case 'rejected':
      return <XCircle className="h-3 w-3" />
    default:
      return <Clock className="h-3 w-3" />
  }
}

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const { selectedLead, setSelectedLead, leadDetailOpen, setLeadDetailOpen } = useAppStore()
  
  // Pagination state
  const [page, setPage] = useState(1)
  const [displayedLeads, setDisplayedLeads] = useState<typeof mockLeads>([])
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const itemsPerPage = 10
  
  // Filter leads based on search query and filters
  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = 
      lead.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesCampaign = campaignFilter === 'all' || lead.campaignName === campaignFilter

    return matchesSearch && matchesStatus && matchesCampaign
  })

  const campaigns = Array.from(new Set(mockLeads.map(lead => lead.campaignName)))
  
  // Load more function for infinite scroll
  const loadMore = () => {
    if (loading) return;
    
    setLoading(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const nextItems = filteredLeads.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
      );
      
      if (nextItems.length > 0) {
        setDisplayedLeads(prev => [...prev, ...nextItems]);
        setPage(prevPage => prevPage + 1);
      }
      
      // Check if we've loaded all available leads
      if (page * itemsPerPage >= filteredLeads.length) {
        setHasMore(false);
      }
      
      setLoading(false);
    }, 500);
  };
  
  // Reset when filters change
  useEffect(() => {
    setDisplayedLeads([]);
    setPage(1);
    setHasMore(true);
    
    // Load initial items
    const initialItems = filteredLeads.slice(0, itemsPerPage);
    setDisplayedLeads(initialItems);
    
    // Update hasMore based on initial load
    if (initialItems.length < itemsPerPage || initialItems.length >= filteredLeads.length) {
      setHasMore(false);
    } else {
      setPage(2); // Set to page 2 for next load
    }
  }, [searchQuery, statusFilter, campaignFilter]);
  
  // Ref for infinite scroll
  const [loadMoreRef] = useInfiniteScroll<HTMLDivElement>({
    loadMore,
    hasMore,
    loading
  });

  const handleLeadClick = (lead: any) => {
    setSelectedLead(lead)
    setLeadDetailOpen(true)
  }

  const handleUpdateStatus = (newStatus: string) => {
    if (selectedLead) {
      // In a real app, you would make an API call here
      console.log('Updating status to:', newStatus)
      setSelectedLead({ ...selectedLead, status: newStatus })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage your leads across all campaigns</p>
        </div>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Import Leads
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Leads</CardTitle>
          <CardDescription>Search and filter your leads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="all">All Campaigns</option>
              {campaigns.map(campaign => (
                <option key={campaign} value={campaign}>{campaign}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Approval</option>
              <option value="contacted">Contacted</option>
              <option value="responded">Responded</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>Click on any lead to view details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {displayedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleLeadClick(lead)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{lead.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-900">{lead.campaignName}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusIcon(lead.status)}
                        <span className="ml-1 capitalize">{lead.status === 'pending' ? 'Pending Approval' : lead.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
                </tbody>
            </table>
            
            {/* Loading indicator and infinite scroll reference */}
            <div ref={loadMoreRef} className="py-4 text-center">
              {loading && (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  <span className="text-gray-500">Loading more leads...</span>
                </div>
              )}
              {!hasMore && displayedLeads.length > 0 && (
                <p className="text-gray-500 text-sm">No more leads to load</p>
              )}
              {!hasMore && displayedLeads.length === 0 && (
                <p className="text-gray-500">No leads match your search criteria</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>      {/* Lead Detail Sheet */}
      <Sheet open={leadDetailOpen} onOpenChange={setLeadDetailOpen}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Lead Details</SheetTitle>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${selectedLead ? getStatusColor(selectedLead.status) : ''}`}>
                {selectedLead && getStatusIcon(selectedLead.status)}
                <span className="ml-1 capitalize">
                  {selectedLead && (selectedLead.status === 'pending' ? 'Pending Approval' : selectedLead.status)}
                </span>
              </span>
            </div>
          </SheetHeader>
          
          {selectedLead && (
            <div className="mt-4 space-y-6">
              {/* Profile Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4 border">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedLead.firstName} {selectedLead.lastName}
                    </h3>
                    <p className="text-gray-600">{selectedLead.position}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{selectedLead.email}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Company</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{selectedLead.company}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Campaign</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{(selectedLead as any).campaignName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3">
                <h4 className="font-medium text-lg border-b pb-2">Activity Timeline</h4>
                <div className="space-y-4">
                  {selectedLead.lastContactDate && (
                    <div className="flex">
                      <div className="mr-3 flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">Message sent</p>
                        <p className="text-xs text-gray-500">{new Date(selectedLead.lastContactDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                  {selectedLead.responseDate && (
                    <div className="flex">
                      <div className="mr-3 flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-600"></div>
                        <div className="w-0.5 h-full bg-gray-200"></div>
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium">Lead responded</p>
                        <p className="text-xs text-gray-500">{new Date(selectedLead.responseDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-3">
                <h4 className="font-medium text-lg border-b pb-2">Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-sm">{selectedLead.notes || "No notes added yet."}</p>
                </div>
                <div className="pt-2">
                  <Input placeholder="Add a note..." className="w-full" />
                </div>
              </div>

              {/* Status Update */}
              <div className="space-y-3">
                <h4 className="font-medium text-lg border-b pb-2">Update Status</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['pending', 'contacted', 'responded', 'converted', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedLead.status === status ? 'default' : 'outline'}
                      size="sm"
                      className={`w-full justify-start ${
                        selectedLead.status === status 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleUpdateStatus(status)}
                    >
                      {getStatusIcon(status)}
                      <span className="ml-2 capitalize text-xs">
                        {status === 'pending' ? 'Pending Approval' : status}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Interaction History */}
              <div className="space-y-3">
                <h4 className="font-medium text-lg border-b pb-2">Interaction History</h4>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Connection Request</span>
                      </div>
                      <span className="text-xs text-gray-500">{selectedLead.lastContactDate ? new Date(selectedLead.lastContactDate).toLocaleDateString() : 'Pending'}</span>
                    </div>
                    <div className="ml-10">
                      <p className="text-sm text-gray-700">
                        Hi {selectedLead.firstName}, I'm building consultative AI solutions for enterprises, and I came across your profile. Would love to connect!
                      </p>
                    </div>
                  </div>
                  
                  {selectedLead.status === 'responded' && (
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium">Lead Response</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {selectedLead.responseDate ? new Date(selectedLead.responseDate).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <div className="ml-10">
                        <p className="text-sm text-gray-700">
                          Thanks for reaching out. I'd be interested in learning more about your AI solutions and how they might benefit our organization.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Actions Section */}
              <div className="space-y-3 pt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Follow-up Message
                </Button>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <h4 className="font-medium">Notes</h4>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedLead.notes}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Lead
                </Button>
                <Button variant="outline" className="flex-1">
                  Add Note
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
