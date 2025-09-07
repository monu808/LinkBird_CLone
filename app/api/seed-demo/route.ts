import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { faker } from '@faker-js/faker'

// Sample data arrays
const campaignNames = [
  'Product Manager Outreach Q4', 'Engineering Leaders Campaign', 'Startup Founders Network',
  'Sales Leaders Q1', 'Marketing Professionals', 'Tech Executives Outreach',
  'Enterprise Decision Makers', 'Software Engineers Q1', 'Data Scientists Network',
  'DevOps Professionals', 'UX/UI Designers', 'Fintech Leaders'
]

const companies = [
  'TechCorp', 'DevStudio', 'InnovateLab', 'SalesForce Inc.', 'BrandCo',
  'DataDynamics', 'CloudFirst', 'AIVentures', 'NextGen Solutions', 'DigitalEdge',
  'Microsoft', 'Google', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify'
]

const jobTitles = [
  'Product Manager', 'Engineering Director', 'Software Engineer', 'Data Scientist',
  'UX Designer', 'Marketing Manager', 'Sales Director', 'DevOps Engineer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Tech Lead'
]

const statuses = ['pending', 'contacted', 'responded', 'converted', 'rejected']

function randomRecentDate() {
  const now = new Date()
  const daysBack = Math.floor(Math.random() * 90)
  return new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
}

function generateNotes() {
  const noteTemplates = [
    'Initial outreach sent via LinkedIn',
    'Follow-up email sent',
    'Interested in learning more about our solution',
    'Scheduled for demo next week',
    'Not interested at this time',
    'Referred to decision maker'
  ]
  
  if (Math.random() > 0.3) {
    return noteTemplates[Math.floor(Math.random() * noteTemplates.length)]
  }
  return null
}

export async function POST() {
  try {
    // Use a default user ID for seeding (you can change this to your actual user ID)
    const defaultUserId = 'demo_user_123'
    
    // Create campaigns
    const campaignInserts = campaignNames.map(name => ({
      name,
      status: faker.helpers.arrayElement(['active', 'inactive', 'draft']),
      userId: defaultUserId,
      startDate: randomRecentDate(),
    }))

    const insertedCampaigns = await db.insert(campaigns).values(campaignInserts).returning()
    
    // Create leads
    const leadInserts = []
    for (let i = 0; i < 200; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const status = faker.helpers.arrayElement(statuses)
      
      const lead = {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        company: faker.helpers.arrayElement(companies),
        position: faker.helpers.arrayElement(jobTitles),
        status,
        campaignId: faker.helpers.arrayElement(insertedCampaigns).id,
        userId: defaultUserId,
        notes: generateNotes(),
        createdAt: randomRecentDate(),
      } as any

      if (status !== 'pending') {
        lead.lastContactDate = randomRecentDate()
      }
      
      if (status === 'responded' || status === 'converted') {
        lead.responseDate = randomRecentDate()
      }

      leadInserts.push(lead)
    }

    await db.insert(leads).values(leadInserts)

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        campaigns: insertedCampaigns.length,
        leads: leadInserts.length,
        userId: defaultUserId
      }
    })

  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
