import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { CampaignQueryParams } from '@/lib/types/api'

interface InfiniteCampaignsParams extends Omit<CampaignQueryParams, 'page'> {
  searchQuery?: string
  selectedStatuses?: string[]
}

export function useInfiniteCampaigns({
  searchQuery,
  selectedStatuses,
  ...params
}: InfiniteCampaignsParams = {}) {
  return useInfiniteQuery({
    queryKey: ['campaigns-infinite', { 
      search: searchQuery, 
      statuses: selectedStatuses,
      ...params 
    }],
    queryFn: ({ pageParam = 1 }) => {
      const queryParams: CampaignQueryParams = {
        ...params,
        page: pageParam,
        limit: 10,
        search: searchQuery || undefined,
        status: selectedStatuses?.length === 1 ? selectedStatuses[0] : undefined,
      }
      
      return apiClient.campaigns.list(queryParams)
    },
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination
      return page < pages ? page + 1 : undefined
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useInfiniteCampaignsData(params: InfiniteCampaignsParams = {}) {
  const query = useInfiniteCampaigns(params)
  
  const campaigns = query.data?.pages.flatMap(page => page.data) || []
  const totalCount = query.data?.pages[0]?.pagination.total || 0
  
  return {
    ...query,
    campaigns,
    totalCount,
  }
}
