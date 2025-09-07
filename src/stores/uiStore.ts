import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface UIState {
  // Sidebar state
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  
  // Search and filters
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedStatuses: string[]
  setSelectedStatuses: (statuses: string[]) => void
  
  // Lead management
  selectedLeadId: string | null
  leadSheetOpen: boolean
  openLeadSheet: (leadId: string) => void
  closeLeadSheet: () => void
  
  // Campaign management
  selectedCampaignId: string | null
  campaignSheetOpen: boolean
  openCampaignSheet: (campaignId: string) => void
  closeCampaignSheet: () => void
  
  // Table state
  selectedRows: Set<string>
  setSelectedRows: (rows: Set<string>) => void
  selectRow: (id: string) => void
  deselectRow: (id: string) => void
  clearSelection: () => void
  
  // View preferences
  tableView: 'grid' | 'table'
  setTableView: (view: 'grid' | 'table') => void
  
  // Active filters for campaigns
  activeCampaignFilter: 'all' | 'active' | 'inactive' | 'draft'
  setActiveCampaignFilter: (filter: 'all' | 'active' | 'inactive' | 'draft') => void
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      // Sidebar state
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // Search and filters
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedStatuses: [],
      setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),
      
      // Lead management
      selectedLeadId: null,
      leadSheetOpen: false,
      openLeadSheet: (leadId) => set({ selectedLeadId: leadId, leadSheetOpen: true }),
      closeLeadSheet: () => set({ selectedLeadId: null, leadSheetOpen: false }),
      
      // Campaign management
      selectedCampaignId: null,
      campaignSheetOpen: false,
      openCampaignSheet: (campaignId) => set({ selectedCampaignId: campaignId, campaignSheetOpen: true }),
      closeCampaignSheet: () => set({ selectedCampaignId: null, campaignSheetOpen: false }),
      
      // Table state
      selectedRows: new Set(),
      setSelectedRows: (rows) => set({ selectedRows: rows }),
      selectRow: (id) => {
        const { selectedRows } = get()
        const newSelection = new Set(selectedRows)
        newSelection.add(id)
        set({ selectedRows: newSelection })
      },
      deselectRow: (id) => {
        const { selectedRows } = get()
        const newSelection = new Set(selectedRows)
        newSelection.delete(id)
        set({ selectedRows: newSelection })
      },
      clearSelection: () => set({ selectedRows: new Set() }),
      
      // View preferences
      tableView: 'table',
      setTableView: (view) => set({ tableView: view }),
      
      // Active filters
      activeCampaignFilter: 'all',
      setActiveCampaignFilter: (filter) => set({ activeCampaignFilter: filter }),
    }),
    {
      name: 'linkbird-ui-store',
    }
  )
)
