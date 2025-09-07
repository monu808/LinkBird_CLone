import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

export interface Campaign {
  id: string
  name: string
  status: 'active' | 'inactive' | 'draft'
  totalLeads: number
  sentCount: number
  responseCount: number
  connectionCount: number
  createdAt: string
  updatedAt: string
  description?: string
  targetAudience?: string
  messageTemplate?: string
  dailyLimit?: number
  requestStatus: {
    pending: number
    sent: number
    connected: number
    declined: number
  }
  connectionStatus: {
    first_degree: number
    second_degree: number
    third_degree: number
  }
  performance: {
    openRate: number
    responseRate: number
    connectionRate: number
  }
}

// Mock campaigns data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Product Manager Outreach Q4',
    status: 'active',
    totalLeads: 150,
    sentCount: 89,
    responseCount: 23,
    connectionCount: 45,
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2025-01-06T14:30:00Z',
    description: 'Targeting senior product managers in SaaS companies',
    targetAudience: 'Senior Product Managers',
    messageTemplate: 'Hi {firstName}, I noticed your work at {company}...',
    dailyLimit: 15,
    requestStatus: {
      pending: 12,
      sent: 89,
      connected: 45,
      declined: 4
    },
    connectionStatus: {
      first_degree: 12,
      second_degree: 78,
      third_degree: 60
    },
    performance: {
      openRate: 68,
      responseRate: 26,
      connectionRate: 51
    }
  },
  {
    id: '2',
    name: 'Engineering Leaders Campaign',
    status: 'active',
    totalLeads: 200,
    sentCount: 156,
    responseCount: 34,
    connectionCount: 67,
    createdAt: '2024-11-15T10:00:00Z',
    updatedAt: '2025-01-06T09:15:00Z',
    description: 'Connecting with VPs and Directors of Engineering',
    targetAudience: 'Engineering Leadership',
    messageTemplate: 'Hello {firstName}, I saw your experience leading engineering teams...',
    dailyLimit: 20,
    requestStatus: {
      pending: 8,
      sent: 156,
      connected: 67,
      declined: 12
    },
    connectionStatus: {
      first_degree: 23,
      second_degree: 112,
      third_degree: 65
    },
    performance: {
      openRate: 72,
      responseRate: 22,
      connectionRate: 43
    }
  },
  {
    id: '3',
    name: 'Startup Founders Network',
    status: 'inactive',
    totalLeads: 85,
    sentCount: 85,
    responseCount: 19,
    connectionCount: 32,
    createdAt: '2024-10-20T08:00:00Z',
    updatedAt: '2024-12-15T16:45:00Z',
    description: 'Building relationships with early-stage startup founders',
    targetAudience: 'Startup Founders',
    messageTemplate: 'Hi {firstName}, fellow entrepreneur here...',
    dailyLimit: 10,
    requestStatus: {
      pending: 0,
      sent: 85,
      connected: 32,
      declined: 8
    },
    connectionStatus: {
      first_degree: 8,
      second_degree: 45,
      third_degree: 32
    },
    performance: {
      openRate: 75,
      responseRate: 22,
      connectionRate: 38
    }
  },
  {
    id: '4',
    name: 'Sales Leaders Q1',
    status: 'draft',
    totalLeads: 0,
    sentCount: 0,
    responseCount: 0,
    connectionCount: 0,
    createdAt: '2025-01-02T12:00:00Z',
    updatedAt: '2025-01-06T11:20:00Z',
    description: 'Targeting sales directors and VPs for Q1 outreach',
    targetAudience: 'Sales Leadership',
    messageTemplate: 'Hello {firstName}, I noticed your impressive sales track record...',
    dailyLimit: 25,
    requestStatus: {
      pending: 0,
      sent: 0,
      connected: 0,
      declined: 0
    },
    connectionStatus: {
      first_degree: 0,
      second_degree: 0,
      third_degree: 0
    },
    performance: {
      openRate: 0,
      responseRate: 0,
      connectionRate: 0
    }
  },
  {
    id: '5',
    name: 'Creative Professionals',
    status: 'active',
    totalLeads: 120,
    sentCount: 76,
    responseCount: 15,
    connectionCount: 28,
    createdAt: '2024-12-10T14:00:00Z',
    updatedAt: '2025-01-06T08:30:00Z',
    description: 'Connecting with creative directors and design leads',
    targetAudience: 'Creative Directors',
    messageTemplate: 'Hi {firstName}, love your creative work at {company}...',
    dailyLimit: 12,
    requestStatus: {
      pending: 5,
      sent: 76,
      connected: 28,
      declined: 3
    },
    connectionStatus: {
      first_degree: 15,
      second_degree: 67,
      third_degree: 38
    },
    performance: {
      openRate: 64,
      responseRate: 20,
      connectionRate: 37
    }
  }
]

// Generate more mock campaigns
const generateMoreCampaigns = (startId: number, count: number): Campaign[] => {
  const statuses: Campaign['status'][] = ['active', 'inactive', 'draft']
  const campaignTypes = ['Tech Leaders', 'Marketing Professionals', 'Sales Executives', 'HR Directors', 'Finance Leaders', 'Operations Managers']
  
  return Array.from({ length: count }, (_, i) => {
    const id = (startId + i).toString()
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const totalLeads = status === 'draft' ? 0 : Math.floor(Math.random() * 200) + 50
    const sentCount = status === 'draft' ? 0 : Math.floor(totalLeads * (0.3 + Math.random() * 0.6))
    const responseCount = Math.floor(sentCount * (0.1 + Math.random() * 0.3))
    const connectionCount = Math.floor(sentCount * (0.2 + Math.random() * 0.4))
    
    return {
      id,
      name: `${campaignTypes[Math.floor(Math.random() * campaignTypes.length)]} ${startId + i}`,
      status,
      totalLeads,
      sentCount,
      responseCount,
      connectionCount,
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      description: `Campaign targeting ${campaignTypes[Math.floor(Math.random() * campaignTypes.length)].toLowerCase()}`,
      dailyLimit: Math.floor(Math.random() * 20) + 10,
      requestStatus: {
        pending: Math.floor(Math.random() * 20),
        sent: sentCount,
        connected: connectionCount,
        declined: Math.floor(Math.random() * 10)
      },
      connectionStatus: {
        first_degree: Math.floor(totalLeads * 0.1),
        second_degree: Math.floor(totalLeads * 0.6),
        third_degree: Math.floor(totalLeads * 0.3)
      },
      performance: {
        openRate: Math.floor(Math.random() * 40) + 40,
        responseRate: Math.floor(Math.random() * 30) + 10,
        connectionRate: Math.floor(Math.random() * 40) + 20
      }
    }
  })
}

const allMockCampaigns = [...mockCampaigns, ...generateMoreCampaigns(6, 20)]

// Mock API functions
const fetchCampaigns = async ({
  page = 1,
  limit = 10,
  search = '',
  status = ''
}: {
  page?: number
  limit?: number
  search?: string
  status?: string
} = {}): Promise<{ data: Campaign[], pagination: { page: number, pages: number, total: number, hasNext: boolean } }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  let filteredCampaigns = allMockCampaigns
  
  // Apply search filter
  if (search) {
    filteredCampaigns = filteredCampaigns.filter(campaign =>
      campaign.name.toLowerCase().includes(search.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  // Apply status filter
  if (status && status !== 'all') {
    filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status)
  }
  
  const total = filteredCampaigns.length
  const pages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const data = filteredCampaigns.slice(startIndex, endIndex)
  
  return {
    data,
    pagination: {
      page,
      pages,
      total,
      hasNext: page < pages
    }
  }
}

const fetchCampaignById = async (id: string): Promise<Campaign | null> => {
  await new Promise(resolve => setTimeout(resolve, 200))
  return allMockCampaigns.find(campaign => campaign.id === id) || null
}

// React Query hooks
export const useCampaigns = ({
  search = '',
  status = '',
  page = 1,
  limit = 10
}: {
  search?: string
  status?: string
  page?: number
  limit?: number
} = {}) => {
  return useQuery({
    queryKey: ['campaigns', { search, status, page, limit }],
    queryFn: () => fetchCampaigns({ search, status, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useInfiniteCampaigns = ({
  search = '',
  status = ''
}: {
  search?: string
  status?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: ['campaigns-infinite', { search, status }],
    queryFn: ({ pageParam = 1 }) => fetchCampaigns({ search, status, page: pageParam, limit: 8 }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  })
}

export const useCampaign = (id: string | null) => {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => id ? fetchCampaignById(id) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
