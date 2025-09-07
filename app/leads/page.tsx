'use client'

import Sidebar from '@/components/layout/sidebar'
import { LeadTable } from '@/src/components/LeadTable'
import { LeadSideSheet } from '@/components/leads/LeadSideSheet'

export default function LeadsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar>
        <div className="flex-1 flex flex-col overflow-hidden">        
          <main className="flex-1 overflow-hidden">
            <LeadTable />
          </main>
        </div>
      </Sidebar>
      
      <LeadSideSheet />
    </div>
  )
}
