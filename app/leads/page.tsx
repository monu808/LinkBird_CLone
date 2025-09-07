'use client'

import { Sidebar } from '@/src/components/Sidebar'
import { Header } from '@/src/components/Header'
import { LeadTable } from '@/src/components/LeadTable'
import { LeadSheet } from '@/src/components/LeadSheet'

export default function LeadsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-hidden">
          <LeadTable />
        </main>
      </div>
      
      <LeadSheet />
    </div>
  )
}
