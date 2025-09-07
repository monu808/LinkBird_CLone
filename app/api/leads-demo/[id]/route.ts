import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, campaigns } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const leadId = parseInt(params.id)
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 })
    }

    // Use demo user ID (from seed data)
    const userId = '1'

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
      .where(eq(leads.id, leadId))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('GET /api/leads-demo/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
