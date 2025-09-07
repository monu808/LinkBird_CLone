'use client'

import { Sidebar } from '@/src/components/Sidebar'
import { Header } from '@/src/components/Header'
import { CampaignTable } from '@/src/components/CampaignTable'

export default function CampaignsPage() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-hidden p-6">
          <CampaignTable />
        </main>
      </div>
    </div>
  )
}
