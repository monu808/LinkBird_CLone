/**
 * Comprehensive seed script with realistic fake data
 * Run this script to populate the database with campaigns, leads, and LinkedIn accounts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { campaigns, leads, linkedinAccounts } from '@/lib/db/schema'

// Use the same database connection as the app
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:linkbird@localhost:5432/linkbird_clone'
const sql = postgres(connectionString)
const db = drizzle(sql)

// Comprehensive fake data
const campaignData = [
  {
    name: 'Product Manager Outreach Q4',
    status: 'active',
    userId: '1',
  },
  {
    name: 'Engineering Leaders Campaign',
    status: 'active',
    userId: '1',
  },
  {
    name: 'Startup Founders Network',
    status: 'active',
    userId: '1',
  },
  {
    name: 'Tech CEOs Outreach',
    status: 'active',
    userId: '1',
  },
  {
    name: 'Sales Directors Campaign',
    status: 'active',
    userId: '1',
  },
  {
    name: 'Marketing Managers Q1',
    status: 'paused',
    userId: '1',
  },
  {
    name: 'Healthcare IT Directors',
    status: 'active',
    userId: '1',
  },
  {
    name: 'FinTech Startup Leads',
    status: 'active',
    userId: '1',
  },
  {
    name: 'E-commerce VPs Outreach',
    status: 'draft',
    userId: '1',
  },
  {
    name: 'DevOps Engineers Network',
    status: 'active',
    userId: '1',
  },
  {
    name: 'SaaS Founders Connect',
    status: 'active',
    userId: '1',
  },
  {
    name: 'Data Scientists Campaign',
    status: 'paused',
    userId: '1',
  }
]

const leadData = [
  // Will be populated dynamically based on actual campaign IDs
]

const linkedinAccountData = [
  {
    email: 'john.doe@company.com',
    name: 'John Doe',
    connected: true,
    requestsUsed: 45,
    requestsLimit: 100,
    userId: '1',
  },
  {
    email: 'jane.smith@business.com',
    name: 'Jane Smith',
    connected: true,
    requestsUsed: 23,
    requestsLimit: 100,
    userId: '1',
  },
  {
    email: 'mike.wilson@enterprise.com',
    name: 'Mike Wilson',
    connected: false,
    requestsUsed: 0,
    requestsLimit: 100,
    userId: '1',
  }
]

// Template lead data that will be used to create leads for each campaign
const leadTemplates = [
  { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@techcorp.com', company: 'TechCorp', position: 'Senior Product Manager', status: 'contacted' },
  { firstName: 'Michael', lastName: 'Chen', email: 'michael.chen@innovate.io', company: 'Innovate.io', position: 'VP of Product', status: 'responded' },
  { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@startup.com', company: 'StartupCo', position: 'Product Manager', status: 'converted' },
  { firstName: 'David', lastName: 'Wilson', email: 'david.wilson@bigtech.com', company: 'BigTech', position: 'Lead Product Manager', status: 'contacted' },
  { firstName: 'Jessica', lastName: 'Brown', email: 'jessica.brown@scale.com', company: 'ScaleCo', position: 'Director of Product', status: 'pending' }
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting comprehensive database seeding...')

    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await db.delete(leads)
    await db.delete(campaigns)
    await db.delete(linkedinAccounts)

    // Create campaigns first
    console.log('📋 Creating campaigns...')
    const insertedCampaigns = await db.insert(campaigns).values(campaignData).returning()
    console.log(`✅ Created ${insertedCampaigns.length} campaigns`)

    // Create leads linked to campaigns
    console.log('👥 Creating leads...')
    const leadData = []
    
    // Create 5 leads for each campaign using the actual campaign IDs
    for (const campaign of insertedCampaigns) {
      for (let i = 0; i < leadTemplates.length; i++) {
        const template = leadTemplates[i]
        leadData.push({
          ...template,
          email: `${template.firstName.toLowerCase()}.${template.lastName.toLowerCase()}${campaign.id}@${template.company.toLowerCase().replace(/\s+/g, '')}.com`,
          campaignId: campaign.id,
          userId: '1'
        })
      }
    }
    
    const insertedLeads = await db.insert(leads).values(leadData).returning()
    console.log(`✅ Created ${insertedLeads.length} leads`)

    // Create LinkedIn accounts
    console.log('🔗 Creating LinkedIn accounts...')
    const insertedAccounts = await db.insert(linkedinAccounts).values(linkedinAccountData).returning()
    console.log(`✅ Created ${insertedAccounts.length} LinkedIn accounts`)

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('📊 Summary:')
    console.log(`   - Campaigns: ${insertedCampaigns.length}`)
    console.log(`   - Leads: ${insertedLeads.length}`)
    console.log(`   - LinkedIn Accounts: ${insertedAccounts.length}`)

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await sql.end()
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
