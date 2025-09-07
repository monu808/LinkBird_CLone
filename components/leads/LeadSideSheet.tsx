import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { StatusPill } from '@/components/ui/status-pill'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useUIStore } from '@/stores/uiStore'
import { apiClient } from '@/lib/api-client'
import { Lead } from '@/lib/types/api'
import { format } from 'date-fns'
import { 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  MessageSquare, 
  ExternalLink,
  Clock,
  CheckCircle,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface LeadSideSheetProps {}

const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock },
  { value: 'contacted', label: 'Contacted', icon: Mail },
  { value: 'responded', label: 'Responded', icon: MessageSquare },
  { value: 'converted', label: 'Converted', icon: CheckCircle },
  { value: 'rejected', label: 'Rejected', icon: X },
]

export function LeadSideSheet({}: LeadSideSheetProps) {
  const { 
    selectedLeadId, 
    isLeadSheetOpen, 
    closeLeadSheet 
  } = useUIStore()
  
  const queryClient = useQueryClient()
  
  // Fetch lead details
  const { data: lead, isLoading } = useQuery({
    queryKey: ['lead', selectedLeadId],
    queryFn: () => selectedLeadId ? apiClient.leads.get(selectedLeadId) : null,
    enabled: !!selectedLeadId,
  })

  // Mutation for updating lead status
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiClient.leads.update(id, { status: status as any }),
    onMutate: async ({ id, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ['lead', id] })
      await queryClient.cancelQueries({ queryKey: ['leads-infinite'] })
      
      // Snapshot previous values
      const previousLead = queryClient.getQueryData(['lead', id])
      const previousLeads = queryClient.getQueryData(['leads-infinite'])
      
      // Optimistically update lead
      if (previousLead) {
        queryClient.setQueryData(['lead', id], {
          ...previousLead,
          status,
        })
      }
      
      // Optimistically update leads list
      if (previousLeads) {
        queryClient.setQueryData(['leads-infinite'], (old: any) => {
          if (!old?.pages) return old
          
          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: page.data.map((lead: Lead) =>
                lead.id === id ? { ...lead, status } : lead
              ),
            })),
          }
        })
      }
      
      return { previousLead, previousLeads }
    },
    onError: (err, variables, context) => {
      // Revert optimistic updates
      if (context?.previousLead) {
        queryClient.setQueryData(['lead', variables.id], context.previousLead)
      }
      if (context?.previousLeads) {
        queryClient.setQueryData(['leads-infinite'], context.previousLeads)
      }
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['lead', selectedLeadId] })
      queryClient.invalidateQueries({ queryKey: ['leads-infinite'] })
    },
  })

  const handleStatusChange = React.useCallback((newStatus: string) => {
    if (lead && lead.id) {
      updateStatusMutation.mutate({ id: lead.id, status: newStatus })
    }
  }, [lead, updateStatusMutation])

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLeadSheet()
    }
  }, [closeLeadSheet])

  React.useEffect(() => {
    if (isLeadSheetOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLeadSheetOpen, handleKeyDown])

  if (!lead && !isLoading) {
    return null
  }

  const initials = lead ? `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase() : ''

  return (
    <Sheet open={isLeadSheetOpen} onOpenChange={closeLeadSheet}>
      <SheetContent className="w-[500px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
          <SheetDescription>
            View and manage lead information
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : lead ? (
          <div className="mt-6 space-y-6">
            {/* Lead Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-600">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-gray-900">
                  {lead.firstName} {lead.lastName}
                </h3>
                {lead.company && (
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Building className="h-3 w-3" />
                    {lead.position ? `${lead.position} at ${lead.company}` : lead.company}
                  </p>
                )}
                <div className="mt-2">
                  <StatusPill status={lead.status} />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <a 
                      href={`mailto:${lead.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>
                
                {lead.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Company</div>
                      <div className="text-sm text-gray-600">{lead.company}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">Added</div>
                    <div className="text-sm text-gray-600">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
                    </div>
                  </div>
                </div>

                {lead.lastContactDate && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Last Contact</div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(lead.lastContactDate), 'MMM d, yyyy \'at\' h:mm a')}
                      </div>
                    </div>
                  </div>
                )}

                {lead.responseDate && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="text-sm font-medium">Response Date</div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(lead.responseDate), 'MMM d, yyyy \'at\' h:mm a')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {lead.notes && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Notes</h4>
                <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                  {lead.notes}
                </div>
              </div>
            )}

            {/* Status Update */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Update Status</h4>
              <div className="grid grid-cols-2 gap-2">
                {statusOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = lead.status === option.value
                  const isLoading = updateStatusMutation.isPending
                  
                  return (
                    <Button
                      key={option.value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(option.value)}
                      disabled={isLoading || isSelected}
                      className={cn(
                        "justify-start gap-2",
                        isSelected && "bg-blue-600 hover:bg-blue-700"
                      )}
                    >
                      <Icon className="h-3 w-3" />
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                className="flex-1"
                onClick={() => window.open(`mailto:${lead.email}`, '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Send Email
              </Button>
              <Button variant="outline" className="flex-1">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
