'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { useInfiniteLeads } from '@/src/hooks/useInfiniteLeads'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import type { Lead } from '@/src/lib/api/leads'

const LeadRow = React.memo(({ lead }: { lead: Lead }) => (
  <TableRow className="hover:bg-gray-50" tabIndex={0}>
    <TableCell className="font-medium">
      {lead.firstName} {lead.lastName}
    </TableCell>
    <TableCell>{lead.campaign}</TableCell>
    <TableCell>{lead.lastContacted ? new Date(lead.lastContacted).toLocaleDateString() : '-'}</TableCell>
    <TableCell>
      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
        lead.status === 'active' ? 'bg-green-100 text-green-800' :
        lead.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {lead.status}
      </span>
    </TableCell>
  </TableRow>
))

const SkeletonRow = React.memo(() => (
  <TableRow>
    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
    <TableCell><div className="h-4 bg-gray-200 rounded animate-pulse" /></TableCell>
  </TableRow>
))

export function LeadTable() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteLeads()

  const leads = data?.pages.flatMap(page => page.data) ?? []

  // Debug logging
  console.log('LeadTable render:', { 
    isLoading, 
    error: error?.message, 
    dataPages: data?.pages?.length, 
    leadsCount: leads.length,
    hasNextPage,
    isFetchingNextPage
  })

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px',
    })

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleIntersection])

  if (isLoading) {
    return (
      <div className="h-full overflow-auto scroll-area" tabIndex={0}>
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Last Contacted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (error) {
    console.error('LeadTable error:', error)
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Error loading leads</p>
          <p className="text-sm text-gray-500">{error.message}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto scroll-area" tabIndex={0}>
      <Table>
        <TableHeader className="sticky top-0 bg-white z-10">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Last Contacted</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
          {isFetchingNextPage && Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={`loading-${i}`} />
          ))}
        </TableBody>
      </Table>
      
      {/* Sentinel element for infinite scroll */}
      <div ref={sentinelRef} className="h-4 flex items-center justify-center">
        {isFetchingNextPage && (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        )}
        {!hasNextPage && leads.length > 0 && (
          <p className="text-sm text-gray-500">All leads loaded</p>
        )}
      </div>
    </div>
  )
}
