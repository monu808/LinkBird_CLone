import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq, and, desc, asc, like, count } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'company']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// GET /api/campaigns/[id]/leads - Get all leads for a specific campaign
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

    // Verify campaign belongs to user
    const campaign = await db
      .select()
      .from(campaigns)
      .where(and(
        eq(campaigns.id, campaignId),
        eq(campaigns.userId, session.user.id)
      ))
      .limit(1)

    if (campaign.length === 0) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const params_query = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(params_query.page)
    const limit = parseInt(params_query.limit)
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = [eq(leads.campaignId, campaignId)]
    
    if (params_query.search) {
      conditions.push(
        like(leads.firstName, `%${params_query.search}%`)
      )
    }
    
    if (params_query.status) {
      conditions.push(eq(leads.status, params_query.status))
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(leads)
      .where(and(...conditions))

    // Get leads with pagination
    let orderBy
    switch (params_query.sortBy) {
      case 'firstName':
        orderBy = params_query.sortOrder === 'asc' ? asc(leads.firstName) : desc(leads.firstName)
        break
      case 'lastName':
        orderBy = params_query.sortOrder === 'asc' ? asc(leads.lastName) : desc(leads.lastName)
        break
      case 'company':
        orderBy = params_query.sortOrder === 'asc' ? asc(leads.company) : desc(leads.company)
        break
      default:
        orderBy = params_query.sortOrder === 'asc' ? asc(leads.createdAt) : desc(leads.createdAt)
    }

    const result = await db
      .select({
        id: leads.id,
        firstName: leads.firstName,
        lastName: leads.lastName,
        email: leads.email,
        company: leads.company,
        position: leads.position,
        status: leads.status,
        lastContactDate: leads.lastContactDate,
        responseDate: leads.responseDate,
        notes: leads.notes,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
      })
      .from(leads)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      data: result,
      campaign: campaign[0],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('GET /api/campaigns/[id]/leads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
