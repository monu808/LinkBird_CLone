import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchLeads, type LeadsResponse } from '@/src/lib/api/leads'

export const useInfiniteLeads = (filters?: { search?: string; status?: string }) => {
  return useInfiniteQuery<LeadsResponse>({
    queryKey: ['leads', filters],
    queryFn: ({ pageParam }) => fetchLeads(pageParam as string, 20),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
