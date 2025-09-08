import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, campaigns } from '@/lib/db/schema'
// import { auth } from '@/lib/auth' // TODO: Replace with Stack Framework auth
import { eq, and, desc, like } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // TODO: Replace with Stack Framework authentication
    // const session = await auth.api.getSession({
    //   headers: request.headers,
    // })

    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // }

    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor') || '0'
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''

    // Convert cursor to offset for simplicity
    const offset = parseInt(cursor)

    // Build where conditions
    const conditions = [eq(leads.userId, "1")] // TODO: Replace with actual user ID
    
    if (search) {
      conditions.push(
        like(leads.firstName, `%${search}%`)
      )
    }
    
    if (status) {
      conditions.push(eq(leads.status, status))
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
        campaign: {
          id: campaigns.id,
          name: campaigns.name,
        }
      })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
      .where(and(...conditions))
      .orderBy(desc(leads.createdAt))
      .limit(limit + 1) // Get one extra to check if there are more
      .offset(offset)

    const hasMore = result.length > limit
    const data = hasMore ? result.slice(0, limit) : result
    const nextCursor = hasMore ? (offset + limit).toString() : null

    // Transform data to match expected format
    const transformedData = data.map(lead => ({
      id: lead.id.toString(),
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company || '',
      campaign: lead.campaign?.name || '',
      status: lead.status,
      lastContacted: lead.lastContactDate,
    }))

    return NextResponse.json({
      data: transformedData,
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('GET /api/leads-infinite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
