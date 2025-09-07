import { useInfiniteQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { PaginatedResponse, Lead, LeadQueryParams } from '@/lib/types/api'

interface InfiniteLeadsParams extends Omit<LeadQueryParams, 'page'> {}

interface LeadsPage extends PaginatedResponse<Lead> {
  nextCursor?: number
}

const fetchLeads = async ({ pageParam = 1, queryKey }: { pageParam: number; queryKey: any }): Promise<LeadsPage> => {
  const [, params] = queryKey as [string, InfiniteLeadsParams]
  
  const response = await apiClient.leads.list({
    ...params,
    page: pageParam,
    limit: params.limit || 20,
  })
  
  // Transform the response to include nextCursor
  const { pagination, data } = response
  const nextCursor = pagination.page < pagination.pages ? pagination.page + 1 : undefined
  
  return {
    ...response,
    nextCursor,
  }
}

export const useInfiniteLeads = (params: InfiniteLeadsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['leads-infinite', params],
    queryFn: fetchLeads,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
  })
}
