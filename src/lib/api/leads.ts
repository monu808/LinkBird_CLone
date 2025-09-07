export type Lead = {
  id: string
  firstName: string
  lastName: string
  company: string
  campaign: string
  status: string
  lastContacted?: string
}

export type LeadsResponse = {
  data: Lead[]
  nextCursor: string | null
  hasMore: boolean
}

export const fetchLeads = async (cursor?: string, limit = 20): Promise<LeadsResponse> => {
  // Convert cursor to page for demo endpoint
  const page = cursor ? Math.floor(parseInt(cursor) / limit) + 1 : 1
  const response = await fetch(`/api/leads-demo?page=${page}&limit=${limit}`)
  if (!response.ok) throw new Error('Failed to fetch leads')
  
  const result = await response.json()
  
  // Transform page-based response to cursor-based
  const currentOffset = (page - 1) * limit
  const nextOffset = currentOffset + limit
  const hasMore = page < (result.pagination?.totalPages || 1)
  const nextCursor = hasMore ? nextOffset.toString() : null
  
  // Transform data format - the API returns data under 'leads' property
  const transformedData = (result.leads || []).map((lead: any) => ({
    id: lead.id.toString(),
    firstName: lead.firstName,
    lastName: lead.lastName,
    company: lead.company || '',
    campaign: lead.campaign?.name || '',
    status: lead.status,
    lastContacted: lead.lastContactDate,
  }))
  
  return {
    data: transformedData,
    nextCursor,
    hasMore,
  }
}
