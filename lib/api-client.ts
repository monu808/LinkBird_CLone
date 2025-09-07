import { authClient } from '@/lib/auth-client'
import type {
  Lead,
  Campaign,
  PaginatedResponse,
  CreateLeadRequest,
  UpdateLeadRequest,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  LeadQueryParams,
  CampaignQueryParams,
} from '@/lib/types/api'

// API utilities for making authenticated requests
class ApiClient {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Leads API
  leads = {
    list: async (params?: LeadQueryParams): Promise<PaginatedResponse<Lead>> => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      const query = searchParams.toString()
      return this.makeRequest<PaginatedResponse<Lead>>(`/leads${query ? `?${query}` : ''}`)
    },

    get: async (id: number): Promise<Lead> => {
      return this.makeRequest<Lead>(`/leads/${id}`)
    },

    create: async (data: CreateLeadRequest): Promise<Lead> => {
      return this.makeRequest<Lead>('/leads', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: number, data: UpdateLeadRequest): Promise<Lead> => {
      return this.makeRequest<Lead>(`/leads/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (id: number): Promise<{ message: string }> => {
      return this.makeRequest<{ message: string }>(`/leads/${id}`, {
        method: 'DELETE',
      })
    },
  }

  // Campaigns API
  campaigns = {
    list: async (params?: CampaignQueryParams): Promise<PaginatedResponse<Campaign>> => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      const query = searchParams.toString()
      return this.makeRequest<PaginatedResponse<Campaign>>(`/campaigns${query ? `?${query}` : ''}`)
    },

    get: async (id: number): Promise<Campaign> => {
      return this.makeRequest<Campaign>(`/campaigns/${id}`)
    },

    getById: async (id: string): Promise<Campaign> => {
      return this.makeRequest<Campaign>(`/campaigns/${id}`)
    },

    create: async (data: CreateCampaignRequest): Promise<Campaign> => {
      return this.makeRequest<Campaign>('/campaigns', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },

    update: async (id: number, data: UpdateCampaignRequest): Promise<Campaign> => {
      return this.makeRequest<Campaign>(`/campaigns/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },

    delete: async (id: number): Promise<{ message: string }> => {
      return this.makeRequest<{ message: string }>(`/campaigns/${id}`, {
        method: 'DELETE',
      })
    },

    getLeads: async (id: string, params?: LeadQueryParams): Promise<{
      data: Lead[]
      campaign: Campaign
      pagination: {
        page: number
        limit: number
        total: number
        pages: number
      }
    }> => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) {
            searchParams.append(key, value.toString())
          }
        })
      }
      const query = searchParams.toString()
      return this.makeRequest(`/campaigns/${id}/leads${query ? `?${query}` : ''}`)
    },

    getSequence: async (id: string): Promise<{
      data: any[]
      campaign: Campaign
    }> => {
      return this.makeRequest(`/campaigns/${id}/sequence`)
    },
  }
}

export const apiClient = new ApiClient()

// React Query hooks for better data fetching
export const useLeads = (params?: LeadQueryParams) => {
  return {
    queryKey: ['leads', params],
    queryFn: () => apiClient.leads.list(params),
  }
}

export const useLead = (id: number) => {
  return {
    queryKey: ['lead', id],
    queryFn: () => apiClient.leads.get(id),
  }
}

export const useCampaigns = (params?: CampaignQueryParams) => {
  return {
    queryKey: ['campaigns', params],
    queryFn: () => apiClient.campaigns.list(params),
  }
}

export const useCampaign = (id: number) => {
  return {
    queryKey: ['campaign', id],
    queryFn: () => apiClient.campaigns.get(id),
  }
}

export const useCampaignLeads = (id: string, params?: LeadQueryParams) => {
  return {
    queryKey: ['campaign-leads', id, params],
    queryFn: () => apiClient.campaigns.getLeads(id, params),
  }
}
