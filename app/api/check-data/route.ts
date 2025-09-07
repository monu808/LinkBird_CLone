import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'

export async function GET() {
  try {
    // Count campaigns
    const campaignCount = await db.select({ count: sql<number>`count(*)` }).from(campaigns)
    
    // Count leads
    const leadCount = await db.select({ count: sql<number>`count(*)` }).from(leads)
    
    // Get sample campaigns (first 5)
    const sampleCampaigns = await db.select().from(campaigns).limit(5)
    
    // Get sample leads (first 5)
    const sampleLeads = await db.select().from(leads).limit(5)
    
    // Count leads by status
    const leadsByStatus = await db.select({
      status: leads.status,
      count: sql<number>`count(*)`
    }).from(leads).groupBy(leads.status)

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          campaigns: campaignCount[0]?.count || 0,
          leads: leadCount[0]?.count || 0
        },
        leadsByStatus,
        samples: {
          campaigns: sampleCampaigns,
          leads: sampleLeads
        }
      }
    })

  } catch (error) {
    console.error('Database check error:', error)
    return NextResponse.json(
      { error: 'Failed to check database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
