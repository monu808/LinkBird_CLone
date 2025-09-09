import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { sql } from 'drizzle-orm'

// GET /api/debug - Debug endpoint to check database state
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    // Get current user info
    const userInfo = session ? {
      id: session.user.id,
      email: session.user.primaryEmail,
      name: session.user.displayName
    } : null

    // Get all campaigns (regardless of user)
    const allCampaigns = await db.select().from(campaigns).limit(10)

    // Get all leads (regardless of user)
    const allLeads = await db.select().from(leads).limit(10)

    // Get unique user IDs from campaigns
    const campaignUserIds = await db
      .select({ userId: campaigns.userId })
      .from(campaigns)
      .groupBy(campaigns.userId)

    // Get unique user IDs from leads
    const leadUserIds = await db
      .select({ userId: leads.userId })
      .from(leads)
      .groupBy(leads.userId)

    // Get campaign count
    const campaignCount = await db.select({ count: sql`count(*)`.as('count') }).from(campaigns)

    // Get lead count
    const leadCount = await db.select({ count: sql`count(*)`.as('count') }).from(leads)

    return NextResponse.json({
      currentUser: userInfo,
      totalCampaigns: campaignCount[0]?.count || 0,
      totalLeads: leadCount[0]?.count || 0,
      campaignUserIds: campaignUserIds.map(u => u.userId),
      leadUserIds: leadUserIds.map(u => u.userId),
      sampleCampaigns: allCampaigns.map(c => ({
        id: c.id,
        name: c.name,
        userId: c.userId,
        status: c.status
      })),
      sampleLeads: allLeads.map(l => ({
        id: l.id,
        firstName: l.firstName,
        lastName: l.lastName,
        email: l.email,
        userId: l.userId,
        campaignId: l.campaignId,
        status: l.status
      }))
    })
  } catch (error) {
    console.error('Debug endpoint error:', error)
    return NextResponse.json(
      { error: 'Debug endpoint error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
