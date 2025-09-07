// API Response Types
export interface Lead {
  id: number
  firstName: string
  lastName: string
  email: string
  company?: string
  position?: string
  status: 'pending' | 'contacted' | 'responded' | 'converted' | 'rejected'
  campaignId: number
  userId: string
  lastContactDate?: string
  responseDate?: string
  notes?: string
  createdAt: string
  updatedAt: string
  campaign?: {
    id: number
    name: string
    status: string
  }
}

export interface Campaign {
  id: number
  name: string
  status: 'active' | 'inactive' | 'draft'
  userId: string
  startDate?: string
  createdAt: string
  updatedAt: string
  leadCount?: number
  totalLeads?: number
  responseRate?: number
  conversionRate?: number
  stats?: {
    total: number
    pending: number
    contacted: number
    responded: number
    converted: number
    rejected: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiError {
  error: string
  details?: any[]
}

// Request Types
export interface CreateLeadRequest {
  firstName: string
  lastName: string
  email: string
  company?: string
  position?: string
  campaignId: number
  notes?: string
}

export interface UpdateLeadRequest {
  firstName?: string
  lastName?: string
  email?: string
  company?: string
  position?: string
  status?: 'pending' | 'contacted' | 'responded' | 'converted' | 'rejected'
  campaignId?: number
  notes?: string
  lastContactDate?: string
  responseDate?: string
}

export interface CreateCampaignRequest {
  name: string
  status?: 'active' | 'inactive' | 'draft'
  startDate?: string
}

export interface UpdateCampaignRequest {
  name?: string
  status?: 'active' | 'inactive' | 'draft'
  startDate?: string
}

export interface LeadQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  campaignId?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CampaignQueryParams {
  page?: number
  limit?: number
  search?: string
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
