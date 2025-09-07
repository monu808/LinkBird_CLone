import { create } from 'zustand'
import { Lead, Campaign } from '@/lib/types/api'

interface AppState {
  // Sidebar state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  
  // Selected items
  selectedLead: Lead | null
  setSelectedLead: (lead: Lead | null) => void
  
  selectedCampaign: Campaign | null
  setSelectedCampaign: (campaign: Campaign | null) => void
  
  // UI state
  leadDetailOpen: boolean
  setLeadDetailOpen: (open: boolean) => void
  
  // Search and filters
  leadSearchQuery: string
  setLeadSearchQuery: (query: string) => void
  
  campaignFilter: string
  setCampaignFilter: (filter: string) => void
  
  statusFilter: string
  setStatusFilter: (filter: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar state
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  // Selected items
  selectedLead: null,
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  
  selectedCampaign: null,
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  
  // UI state
  leadDetailOpen: false,
  setLeadDetailOpen: (open) => set({ leadDetailOpen: open }),
  
  // Search and filters
  leadSearchQuery: '',
  setLeadSearchQuery: (query) => set({ leadSearchQuery: query }),
  
  campaignFilter: 'all',
  setCampaignFilter: (filter) => set({ campaignFilter: filter }),
  
  statusFilter: 'all',
  setStatusFilter: (filter) => set({ statusFilter: filter }),
}))
