import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, campaigns } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq, and, desc, asc, like, count } from 'drizzle-orm'
import { z } from 'zod'

// Validation schemas
const createLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  position: z.string().optional(),
  campaignId: z.number().int().positive('Campaign ID is required'),
  notes: z.string().optional(),
})

const updateLeadSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(['pending', 'contacted', 'responded', 'converted', 'rejected']).optional(),
  campaignId: z.number().int().positive().optional(),
  notes: z.string().optional(),
  lastContactDate: z.string().optional(),
  responseDate: z.string().optional(),
})

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  status: z.string().optional(),
  campaignId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'company']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// GET /api/leads - List leads with pagination and filtering
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
    const conditions = [eq(leads.userId, session.user.id)]
    
    if (params.search) {
      conditions.push(
        like(leads.firstName, `%${params.search}%`)
      )
    }
    
    if (params.status) {
      conditions.push(eq(leads.status, params.status))
    }
    
    if (params.campaignId) {
      conditions.push(eq(leads.campaignId, parseInt(params.campaignId)))
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(leads)
      .where(and(...conditions))

    // Get leads with pagination
    let orderBy
    switch (params.sortBy) {
      case 'firstName':
        orderBy = params.sortOrder === 'asc' ? asc(leads.firstName) : desc(leads.firstName)
        break
      case 'lastName':
        orderBy = params.sortOrder === 'asc' ? asc(leads.lastName) : desc(leads.lastName)
        break
      case 'company':
        orderBy = params.sortOrder === 'asc' ? asc(leads.company) : desc(leads.company)
        break
      default:
        orderBy = params.sortOrder === 'asc' ? asc(leads.createdAt) : desc(leads.createdAt)
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
        campaignId: leads.campaignId,
        lastContactDate: leads.lastContactDate,
        responseDate: leads.responseDate,
        notes: leads.notes,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
        campaign: {
          id: campaigns.id,
          name: campaigns.name,
          status: campaigns.status,
        }
      })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
      .where(and(...conditions))
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
    console.error('GET /api/leads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/leads - Create a new lead
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createLeadSchema.parse(body)

    // Verify campaign belongs to user
    const campaign = await db
      .select()
      .from(campaigns)
      .where(and(
        eq(campaigns.id, validatedData.campaignId),
        eq(campaigns.userId, session.user.id)
      ))
      .limit(1)

    if (campaign.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found or access denied' },
        { status: 404 }
      )
    }

    const [newLead] = await db
      .insert(leads)
      .values({
        ...validatedData,
        userId: session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning()

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('POST /api/leads error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
