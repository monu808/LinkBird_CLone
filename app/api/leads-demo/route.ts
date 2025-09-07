import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, campaigns } from '@/lib/db/schema'
import { eq, and, desc, asc, like, count } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  search: z.string().optional(),
  status: z.string().optional(),
  campaignId: z.string().optional(),
  sortBy: z.enum(['createdAt', 'firstName', 'lastName', 'company']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// GET /api/leads-demo - List leads without authentication for demo
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = querySchema.parse(Object.fromEntries(searchParams))
    
    const page = parseInt(params.page)
    const limit = parseInt(params.limit)
    const offset = (page - 1) * limit

    // Use demo user ID
    const demoUserId = 'demo_user_123'

    // Build where conditions
    const conditions = [eq(leads.userId, demoUserId)]
    
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
      leads: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })

  } catch (error) {
    console.error('Leads fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
