import { useQuery, useInfiniteQuery } from '@tanstack/react-query'

export interface Lead {
  id: string
  firstName: string
  lastName: string
  email: string
  title: string
  company: string
  campaignName: string
  status: 'pending_approval' | 'sent' | 'connected' | 'replied' | 'not_interested'
  lastContacted: string
  avatar?: string
  linkedin?: string
  location?: string
  industry?: string
  connectionStatus: 'not_sent' | 'pending' | 'connected' | 'declined'
  responseRate?: number
  activities: Array<{
    id: string
    type: 'invitation' | 'follow_up' | 'connection' | 'message' | 'reply'
    date: string
    status: 'completed' | 'pending' | 'failed'
    message?: string
  }>
}

// Mock leads data
const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@techcorp.com',
    title: 'Senior Product Manager',
    company: 'TechCorp Inc.',
    campaignName: 'Product Manager Outreach Q4',
    status: 'connected',
    lastContacted: '2025-01-06T10:30:00Z',
    linkedin: 'https://linkedin.com/in/sarahjohnson',
    location: 'San Francisco, CA',
    industry: 'Technology',
    connectionStatus: 'connected',
    responseRate: 85,
    activities: [
      { id: '1', type: 'invitation', date: '2025-01-05T09:00:00Z', status: 'completed' },
      { id: '2', type: 'connection', date: '2025-01-05T14:30:00Z', status: 'completed' },
      { id: '3', type: 'message', date: '2025-01-06T10:30:00Z', status: 'completed', message: 'Thanks for connecting!' }
    ]
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@innovate.co',
    title: 'VP of Engineering',
    company: 'Innovate Co.',
    campaignName: 'Engineering Leaders Campaign',
    status: 'sent',
    lastContacted: '2025-01-06T08:15:00Z',
    linkedin: 'https://linkedin.com/in/michaelchen',
    location: 'New York, NY',
    industry: 'Software',
    connectionStatus: 'pending',
    responseRate: 62,
    activities: [
      { id: '1', type: 'invitation', date: '2025-01-06T08:15:00Z', status: 'completed' }
    ]
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.r@startup.io',
    title: 'Founder & CEO',
    company: 'Startup.io',
    campaignName: 'Startup Founders Network',
    status: 'replied',
    lastContacted: '2025-01-05T16:45:00Z',
    linkedin: 'https://linkedin.com/in/emilyrodriguez',
    location: 'Austin, TX',
    industry: 'Fintech',
    connectionStatus: 'connected',
    responseRate: 91,
    activities: [
      { id: '1', type: 'invitation', date: '2025-01-04T10:00:00Z', status: 'completed' },
      { id: '2', type: 'connection', date: '2025-01-04T15:30:00Z', status: 'completed' },
      { id: '3', type: 'message', date: '2025-01-05T09:00:00Z', status: 'completed' },
      { id: '4', type: 'reply', date: '2025-01-05T16:45:00Z', status: 'completed', message: 'Interested in learning more!' }
    ]
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Kim',
    email: 'dkim@enterprise.com',
    title: 'Director of Sales',
    company: 'Enterprise Solutions',
    campaignName: 'Sales Leaders Q1',
    status: 'pending_approval',
    lastContacted: '2025-01-06T07:00:00Z',
    linkedin: 'https://linkedin.com/in/davidkim',
    location: 'Chicago, IL',
    industry: 'Enterprise Software',
    connectionStatus: 'not_sent',
    responseRate: 0,
    activities: []
  },
  {
    id: '5',
    firstName: 'Lisa',
    lastName: 'Wang',
    email: 'lwang@design.agency',
    title: 'Creative Director',
    company: 'Design Agency',
    campaignName: 'Creative Professionals',
    status: 'not_interested',
    lastContacted: '2025-01-05T12:00:00Z',
    linkedin: 'https://linkedin.com/in/lisawang',
    location: 'Los Angeles, CA',
    industry: 'Design',
    connectionStatus: 'declined',
    responseRate: 0,
    activities: [
      { id: '1', type: 'invitation', date: '2025-01-05T12:00:00Z', status: 'failed' }
    ]
  }
]

// Generate more mock data
const generateMoreLeads = (startId: number, count: number): Lead[] => {
  const statuses: Lead['status'][] = ['pending_approval', 'sent', 'connected', 'replied', 'not_interested']
  const connectionStatuses: Lead['connectionStatus'][] = ['not_sent', 'pending', 'connected', 'declined']
  const companies = ['TechStart', 'InnovateCorp', 'DataFlow Inc', 'CloudTech', 'NextGen Solutions', 'DevCorp', 'ScaleUp', 'GrowthCo']
  const titles = ['Software Engineer', 'Product Manager', 'VP Engineering', 'CTO', 'Founder', 'Director of Sales', 'Marketing Manager', 'Data Scientist']
  const campaigns = ['Tech Leaders Q1', 'Startup Founders', 'Engineering Managers', 'Product Leaders', 'Sales Professionals']
  
  return Array.from({ length: count }, (_, i) => {
    const id = (startId + i).toString()
    const firstName = `User${startId + i}`
    const lastName = `Last${startId + i}`
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const connectionStatus = connectionStatuses[Math.floor(Math.random() * connectionStatuses.length)]
    
    return {
      id,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      title: titles[Math.floor(Math.random() * titles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      campaignName: campaigns[Math.floor(Math.random() * campaigns.length)],
      status,
      lastContacted: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      linkedin: `https://linkedin.com/in/${firstName.toLowerCase()}${lastName.toLowerCase()}`,
      location: 'San Francisco, CA',
      industry: 'Technology',
      connectionStatus,
      responseRate: Math.floor(Math.random() * 100),
      activities: []
    }
  })
}

const allMockLeads = [...mockLeads, ...generateMoreLeads(6, 50)]

// Mock API functions
const fetchLeads = async ({ 
  page = 1, 
  limit = 10, 
  search = '', 
  status = '' 
}: {
  page?: number
  limit?: number
  search?: string
  status?: string
} = {}): Promise<{ data: Lead[], pagination: { page: number, pages: number, total: number, hasNext: boolean } }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filteredLeads = allMockLeads
  
  // Apply search filter
  if (search) {
    filteredLeads = filteredLeads.filter(lead => 
      lead.firstName.toLowerCase().includes(search.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.title.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  // Apply status filter
  if (status && status !== 'all') {
    filteredLeads = filteredLeads.filter(lead => lead.status === status)
  }
  
  const total = filteredLeads.length
  const pages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const data = filteredLeads.slice(startIndex, endIndex)
  
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

const fetchLeadById = async (id: string): Promise<Lead | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return allMockLeads.find(lead => lead.id === id) || null
}

// React Query hooks
export const useLeads = ({ 
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
    queryKey: ['leads', { search, status, page, limit }],
    queryFn: () => fetchLeads({ search, status, page, limit }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useInfiniteLeads = ({ 
  search = '', 
  status = '' 
}: {
  search?: string
  status?: string
} = {}) => {
  return useInfiniteQuery({
    queryKey: ['leads-infinite', { search, status }],
    queryFn: ({ pageParam = 1 }) => fetchLeads({ search, status, page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  })
}

export const useLead = (id: string | null) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => id ? fetchLeadById(id) : null,
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
