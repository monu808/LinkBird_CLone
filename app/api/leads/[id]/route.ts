import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { leads, campaigns } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

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

// GET /api/leads/[id] - Get a specific lead
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const leadId = parseInt(resolvedParams.id)
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 })
    }

    const [lead] = await db
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
      .where(and(
        eq(leads.id, leadId),
        eq(leads.userId, session.user.id)
      ))
      .limit(1)

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/leads/[id] - Update a specific lead
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const leadId = parseInt(resolvedParams.id)
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = updateLeadSchema.parse(body)

    // Verify lead belongs to user
    const existingLead = await db
      .select()
      .from(leads)
      .where(and(
        eq(leads.id, leadId),
        eq(leads.userId, session.user.id)
      ))
      .limit(1)

    if (existingLead.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // If campaignId is being updated, verify it belongs to user
    if (validatedData.campaignId) {
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
    }

    // Convert date strings to Date objects if provided
    const updateData: any = { ...validatedData }
    if (updateData.lastContactDate) {
      updateData.lastContactDate = new Date(updateData.lastContactDate)
    }
    if (updateData.responseDate) {
      updateData.responseDate = new Date(updateData.responseDate)
    }
    updateData.updatedAt = new Date()

    const [updatedLead] = await db
      .update(leads)
      .set(updateData)
      .where(eq(leads.id, leadId))
      .returning()

    return NextResponse.json(updatedLead)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    
    console.error('PUT /api/leads/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/leads/[id] - Delete a specific lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const leadId = parseInt(resolvedParams.id)
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 })
    }

    // Verify lead belongs to user
    const existingLead = await db
      .select()
      .from(leads)
      .where(and(
        eq(leads.id, leadId),
        eq(leads.userId, session.user.id)
      ))
      .limit(1)

    if (existingLead.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    await db
      .delete(leads)
      .where(eq(leads.id, leadId))

    return NextResponse.json({ message: 'Lead deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
