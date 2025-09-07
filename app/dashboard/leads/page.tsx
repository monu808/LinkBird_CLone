'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, Plus } from 'lucide-react'
import { LeadTable } from '@/src/components/LeadTable'
import { LeadSideSheet } from '@/components/leads/LeadSideSheet'

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 px-6">
      {/* Header section */}
      <div className="pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage and track your lead interactions</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Filters section */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Main content card with internal scrolling */}
      <Card className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">All Leads</h3>
            <p className="text-sm text-gray-600">Track and manage your lead database</p>
          </div>
        </div>
        
        <div className="h-[calc(100vh-320px)] overflow-auto rounded-md" aria-label="Leads list container">
          <LeadTable />
        </div>
      </Card>
      
      {/* Lead side sheet */}
      <LeadSideSheet />
    </div>
  )
}
