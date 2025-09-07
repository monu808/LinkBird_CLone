import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'

// GET /api/campaigns/demo/[id] - Get a specific campaign without authentication for demo purposes
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const campaignId = parseInt(params.id)
    console.log('Demo campaign details API called for ID:', campaignId)
    
    if (isNaN(campaignId)) {
      return NextResponse.json(
        { error: 'Invalid campaign ID' },
        { status: 400 }
      )
    }

    // Get campaign details
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .limit(1)

    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      )
    }

    // Get total leads for this campaign
    const [totalLeadsResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.campaignId, campaignId))

    // Get leads by status
    const leadStats = await db
      .select({
        status: leads.status,
        count: count()
      })
      .from(leads)
      .where(eq(leads.campaignId, campaignId))
      .groupBy(leads.status)

    // Calculate stats
    const totalLeads = totalLeadsResult?.count || 0
    const contacted = leadStats.find(s => s.status === 'contacted')?.count || 0
    const responded = leadStats.find(s => s.status === 'responded')?.count || 0
    const converted = leadStats.find(s => s.status === 'converted')?.count || 0

    const campaignWithStats = {
      ...campaign,
      totalLeads,
      stats: {
        contacted,
        responded,
        converted
      }
    }

    console.log('Returning campaign details:', campaignWithStats)

    return NextResponse.json(campaignWithStats)

  } catch (error) {
    console.error('Demo campaign details API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
