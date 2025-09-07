import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq, and, count } from 'drizzle-orm'
import { z } from 'zod'

const updateCampaignSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  startDate: z.string().optional(),
})

// GET /api/campaigns/[id] - Get a specific campaign with stats
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    // Get campaign details
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, session.user.id)
      ))
      .limit(1)

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Get lead statistics
    const leadStats = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .where(eq(leads.campaignId, campaignId))
      .groupBy(leads.status)

    // Get total lead count
    const [{ totalLeads }] = await db
      .select({ totalLeads: count() })
      .from(leads)
      .where(eq(leads.campaignId, campaignId))

    // Format lead statistics
    const stats = {
      total: totalLeads,
      pending: 0,
      contacted: 0,
      responded: 0,
      converted: 0,
      rejected: 0,
    }

    leadStats.forEach(stat => {
      if (stat.status in stats) {
        stats[stat.status as keyof typeof stats] = stat.count
      }
    })

    return NextResponse.json({
      ...campaign,
      stats,
    })
  } catch (error) {
    console.error('GET /api/campaigns/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/campaigns/[id] - Update a specific campaign
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = updateCampaignSchema.parse(body)

    // Verify campaign belongs to user
    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, session.user.id)
      ))
      .limit(1)

    if (existingCampaign.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Convert startDate string to Date if provided
    const updateData: any = { ...validatedData }
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate)
    }
    updateData.updatedAt = new Date()

    const [updatedCampaign] = await db
      .update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, campaignId))
      .returning()

    return NextResponse.json(updatedCampaign)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('PUT /api/campaigns/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/campaigns/[id] - Delete a specific campaign
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const campaignId = parseInt(params.id)
    if (isNaN(campaignId)) {
      return NextResponse.json({ error: 'Invalid campaign ID' }, { status: 400 })
    }

    // Verify campaign belongs to user
    const existingCampaign = await db
      .select()
      .from(campaigns)
      .where(and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, session.user.id)
      ))
      .limit(1)

    if (existingCampaign.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Check if campaign has leads
    const [{ leadCount }] = await db
      .select({ leadCount: count() })
      .from(leads)
      .where(eq(leads.campaignId, campaignId))

    if (leadCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete campaign with existing leads. Delete leads first.' },
        { status: 400 }
      )
    }

    await db
      .delete(campaigns)
      .where(eq(campaigns.id, campaignId))

    return NextResponse.json({ message: 'Campaign deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/campaigns/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
