import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { desc, count, eq } from 'drizzle-orm'

// GET /api/campaigns/demo - List campaigns without authentication for demo purposes
export async function GET(request: NextRequest) {
  try {
    console.log('Demo campaigns API called')
    
    // Get campaigns with lead counts
    const campaignList = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        status: campaigns.status,
        userId: campaigns.userId,
        startDate: campaigns.startDate,
        createdAt: campaigns.createdAt,
        updatedAt: campaigns.updatedAt,
      })
      .from(campaigns)
      .orderBy(desc(campaigns.createdAt))
      .limit(50)

    console.log(`Found ${campaignList.length} campaigns`)

    // Get lead stats for each campaign
    const campaignsWithStats = await Promise.all(
      campaignList.map(async (campaign) => {
        // Get total leads for this campaign
        const [totalLeadsResult] = await db
          .select({ count: count() })
          .from(leads)
          .where(eq(leads.campaignId, campaign.id))

        // Get leads by status
        const leadStats = await db
          .select({
            status: leads.status,
            count: count()
          })
          .from(leads)
          .where(eq(leads.campaignId, campaign.id))
          .groupBy(leads.status)

        // Calculate stats
        const totalLeads = totalLeadsResult?.count || 0
        const contacted = leadStats.find(s => s.status === 'contacted')?.count || 0
        const responded = leadStats.find(s => s.status === 'responded')?.count || 0
        const converted = leadStats.find(s => s.status === 'converted')?.count || 0

        return {
          ...campaign,
          totalLeads,
          stats: {
            contacted,
            responded,
            converted
          }
        }
      })
    )

    console.log('Returning campaigns with stats:', campaignsWithStats.length)

    return NextResponse.json({
      data: campaignsWithStats,
      pagination: {
        page: 1,
        limit: 50,
        total: campaignsWithStats.length,
        totalPages: 1
      }
    })

  } catch (error) {
    console.error('Demo campaigns API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaigns', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
