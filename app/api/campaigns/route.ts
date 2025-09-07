import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq, and, desc, asc, like, count } from 'drizzle-orm'
import { z } from 'zod'

// Validation schemas
const createCampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required').max(255),
  status: z.enum(['active', 'inactive', 'draft']).optional().default('draft'),
  startDate: z.string().optional(),
})

const updateCampaignSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  startDate: z.string().optional(),
})

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(['createdAt', 'name', 'startDate']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// GET /api/campaigns - List campaigns with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const params = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(params.page)
    const limit = parseInt(params.limit)
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = [eq(campaigns.userId, session.user.id)]
    
    if (params.search) {
      conditions.push(like(campaigns.name, `%${params.search}%`))
    }
    
    if (params.status) {
      conditions.push(eq(campaigns.status, params.status))
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(campaigns)
      .where(and(...conditions))

    // Get campaigns with lead counts
    let orderBy
    switch (params.sortBy) {
      case 'name':
        orderBy = params.sortOrder === 'asc' ? asc(campaigns.name) : desc(campaigns.name)
        break
      case 'startDate':
        orderBy = params.sortOrder === 'asc' ? asc(campaigns.startDate) : desc(campaigns.startDate)
        break
      default:
        orderBy = params.sortOrder === 'asc' ? asc(campaigns.createdAt) : desc(campaigns.createdAt)
    }

    const result = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        status: campaigns.status,
        startDate: campaigns.startDate,
        createdAt: campaigns.createdAt,
        updatedAt: campaigns.updatedAt,
        leadCount: count(leads.id),
      })
      .from(campaigns)
      .leftJoin(leads, eq(campaigns.id, leads.campaignId))
      .where(and(...conditions))
      .groupBy(campaigns.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    return NextResponse.json({
      data: result,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error('GET /api/campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/campaigns - Create a new campaign
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCampaignSchema.parse(body)

    // Convert startDate string to Date if provided
    const insertData: any = {
      ...validatedData,
      userId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (validatedData.startDate) {
      insertData.startDate = new Date(validatedData.startDate)
    }

    const [newCampaign] = await db
      .insert(campaigns)
      .values(insertData)
      .returning()

    return NextResponse.json(newCampaign, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('POST /api/campaigns error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
