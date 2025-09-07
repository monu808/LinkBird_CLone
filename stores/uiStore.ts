import { create } from 'zustand'
import { Lead, Campaign } from '@/lib/types/api'

interface UIState {
  // Lead side sheet
  selectedLeadId: number | null
  isLeadSheetOpen: boolean
  openLeadSheet: (leadId: number) => void
  closeLeadSheet: () => void
  
  // Campaign side sheet
  selectedCampaignId: number | null
  isCampaignSheetOpen: boolean
  openCampaignSheet: (campaignId: number) => void
  closeCampaignSheet: () => void
  
  // Table sorting
  leadsSortBy: string
  leadsSortOrder: 'asc' | 'desc'
  setLeadsSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  
  campaignsSortBy: string
  campaignsSortOrder: 'asc' | 'desc'
  setCampaignsSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void
  
  // Filters
  selectedStatuses: string[]
  setSelectedStatuses: (statuses: string[]) => void
  
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  // Lead side sheet
  selectedLeadId: null,
  isLeadSheetOpen: false,
  openLeadSheet: (leadId) => set({ selectedLeadId: leadId, isLeadSheetOpen: true }),
  closeLeadSheet: () => set({ selectedLeadId: null, isLeadSheetOpen: false }),
  
  // Campaign side sheet
  selectedCampaignId: null,
  isCampaignSheetOpen: false,
  openCampaignSheet: (campaignId) => set({ selectedCampaignId: campaignId, isCampaignSheetOpen: true }),
  closeCampaignSheet: () => set({ selectedCampaignId: null, isCampaignSheetOpen: false }),
  
  // Table sorting
  leadsSortBy: 'createdAt',
  leadsSortOrder: 'desc',
  setLeadsSort: (sortBy, sortOrder) => set({ leadsSortBy: sortBy, leadsSortOrder: sortOrder }),
  
  campaignsSortBy: 'createdAt',
  campaignsSortOrder: 'desc',
  setCampaignsSort: (sortBy, sortOrder) => set({ campaignsSortBy: sortBy, campaignsSortOrder: sortOrder }),
  
  // Filters
  selectedStatuses: [],
  setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),
  
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}))
