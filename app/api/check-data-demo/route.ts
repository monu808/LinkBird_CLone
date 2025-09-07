import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { sql, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const demoUserId = 'demo_user_123'
    
    // Count campaigns for demo user
    const campaignCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaigns)
      .where(eq(campaigns.userId, demoUserId))
    
    // Count leads for demo user
    const leadCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(eq(leads.userId, demoUserId))
    
    // Get sample campaigns (first 5) for demo user
    const sampleCampaigns = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, demoUserId))
      .limit(5)
    
    // Get sample leads (first 5) for demo user
    const sampleLeads = await db
      .select()
      .from(leads)
      .where(eq(leads.userId, demoUserId))
      .limit(5)
    
    // Count leads by status for demo user
    const leadsByStatus = await db
      .select({
        status: leads.status,
        count: sql<number>`count(*)`
      })
      .from(leads)
      .where(eq(leads.userId, demoUserId))
      .groupBy(leads.status)

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
