/**
 * Script to seed the database with large sample data for testing
 * Run this script to populate the database with comprehensive campaigns and leads
 */

import { db } from '@/lib/db'
import { campaigns, leads } from '@/lib/db/schema'
import { faker } from '@faker-js/faker'

// Sample campaign names
const campaignNames = [
  'Product Manager Outreach Q4',
  'Engineering Leaders Campaign',
  'Startup Founders Network',
  'Sales Leaders Q1',
  'Marketing Professionals',
  'Tech Executives Outreach',
  'Enterprise Decision Makers',
  'Software Engineers Q1',
  'Data Scientists Network',
  'DevOps Professionals',
  'UX/UI Designers',
  'Fintech Leaders',
  'Healthcare IT Managers',
  'E-commerce Directors',
  'Digital Marketing Experts',
  'AI/ML Specialists',
  'Cybersecurity Professionals',
  'Cloud Architects',
  'Mobile Developers',
  'Product Designers',
  'Growth Hackers',
  'HR Technology Leaders',
  'Supply Chain Managers',
  'Real Estate Tech',
  'EdTech Innovators'
]

// Sample companies
const companies = [
  'TechCorp', 'DevStudio', 'InnovateLab', 'SalesForce Inc.', 'BrandCo',
  'DataDynamics', 'CloudFirst', 'AIVentures', 'NextGen Solutions', 'DigitalEdge',
  'CyberShield', 'GrowthLabs', 'ProductFlow', 'DesignHub', 'CodeCraft',
  'MetricsPlus', 'ScaleUp', 'TechFlow', 'InnovateNow', 'FutureStack',
  'ByteWorks', 'PixelPerfect', 'DataMind', 'CloudNet', 'AppForge',
  'TechNova', 'BuildFast', 'GrowthHQ', 'CodeFirst', 'DesignLab',
  'Microsoft', 'Google', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Spotify',
  'Uber', 'Airbnb', 'Stripe', 'Shopify', 'Slack', 'Zoom', 'Figma',
  'Notion', 'Discord', 'GitHub', 'GitLab', 'Atlassian', 'Salesforce'
]

// Sample job titles
const jobTitles = [
  'Product Manager', 'Engineering Director', 'Software Engineer', 'Data Scientist',
  'UX Designer', 'Marketing Manager', 'Sales Director', 'DevOps Engineer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Tech Lead', 'Engineering Manager', 'VP of Engineering', 'CTO',
  'Product Designer', 'Growth Manager', 'Digital Marketing Specialist',
  'Business Analyst', 'Project Manager', 'Scrum Master', 'QA Engineer',
  'Security Engineer', 'Cloud Architect', 'Mobile Developer',
  'AI/ML Engineer', 'Data Engineer', 'Product Owner', 'Solution Architect',
  'Principal Engineer', 'Staff Engineer', 'Senior Engineer',
  'Junior Developer', 'Intern', 'Consultant', 'Freelancer'
]

// Lead statuses
const statuses = ['pending', 'contacted', 'responded', 'converted', 'rejected']

// Function to generate random date within last 90 days
function randomRecentDate() {
  const now = new Date()
  const daysBack = Math.floor(Math.random() * 90)
  return new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))
}

// Function to generate sample notes
function generateNotes() {
  const noteTemplates = [
    'Initial outreach sent via LinkedIn',
    'Follow-up email sent',
    'Interested in learning more about our solution',
    'Scheduled for demo next week',
    'Not interested at this time',
    'Referred to decision maker',
    'Requested pricing information',
    'Asked to reconnect in Q2',
    'Very engaged during call',
    'Needs approval from team lead',
    'Budget allocated for Q1',
    'Currently evaluating alternatives',
    'Positive response, following up',
    'Out of office, will follow up later'
  ]
  
  if (Math.random() > 0.3) {
    return noteTemplates[Math.floor(Math.random() * noteTemplates.length)]
  }
  return null
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Default user ID (should match your auth system)
    const defaultUserId = 'user_default_123'
    
    // Create campaigns first
    console.log('📋 Creating campaigns...')
    const campaignInserts = []
    
    for (let i = 0; i < 25; i++) {
      campaignInserts.push({
        name: campaignNames[i],
        status: faker.helpers.arrayElement(['active', 'inactive', 'draft']),
        userId: defaultUserId,
        startDate: randomRecentDate(),
      })
    }

    const insertedCampaigns = await db.insert(campaigns).values(campaignInserts).returning()
    console.log(`✅ Created ${insertedCampaigns.length} campaigns`)

    // Create leads
    console.log('👥 Creating leads...')
    const leadInserts = []
    
    for (let i = 0; i < 750; i++) {
      const firstName = faker.person.firstName()
      const lastName = faker.person.lastName()
      const company = faker.helpers.arrayElement(companies)
      const status = faker.helpers.arrayElement(statuses)
      const campaignId = faker.helpers.arrayElement(insertedCampaigns).id
      
      const leadData = {
        firstName,
        lastName,
        email: faker.internet.email({ firstName, lastName }),
        company,
        position: faker.helpers.arrayElement(jobTitles),
        status,
        campaignId,
        userId: defaultUserId,
        notes: generateNotes(),
        createdAt: randomRecentDate(),
      }

      // Add optional fields based on status
      const lead = { ...leadData } as any

      if (status !== 'pending') {
        lead.lastContactDate = randomRecentDate()
      }
      
      if (status === 'responded' || status === 'converted') {
        lead.responseDate = randomRecentDate()
      }

      leadInserts.push(lead)
    }

    // Insert leads in batches of 100
    const batchSize = 100
    let totalInserted = 0
    
    for (let i = 0; i < leadInserts.length; i += batchSize) {
      const batch = leadInserts.slice(i, i + batchSize)
      await db.insert(leads).values(batch)
      totalInserted += batch.length
      console.log(`📈 Inserted ${totalInserted}/${leadInserts.length} leads`)
    }

    console.log('🎉 Database seeding completed successfully!')
    console.log(`📊 Total data created:`)
    console.log(`   - Campaigns: ${insertedCampaigns.length}`)
    console.log(`   - Leads: ${totalInserted}`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✅ Seeding completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
