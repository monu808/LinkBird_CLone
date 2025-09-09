/**
 * Simple seed script to create basic test data
 */

import { db } from '../lib/db'
import { campaigns, leads } from '../lib/db/schema'

async function seedBasicData() {
  try {
    console.log('🌱 Starting basic database seeding...')
    
    // Insert sample campaigns
    const sampleCampaigns = await db.insert(campaigns).values([
      {
        name: 'Sample Campaign 1',
        status: 'active',
        userId: '1', // Default user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sample Campaign 2', 
        status: 'draft',
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sample Campaign 3',
        status: 'inactive', 
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]).returning()

    console.log(`✅ Created ${sampleCampaigns.length} campaigns`)

    // Insert some sample leads
    const sampleLeads = await db.insert(leads).values([
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        company: 'Tech Corp',
        position: 'Software Engineer',
        status: 'new',
        campaignId: sampleCampaigns[0].id,
        userId: '1', // Default user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        company: 'Design Studio',
        position: 'UX Designer',
        status: 'contacted',
        campaignId: sampleCampaigns[0].id,
        userId: '1', // Default user ID
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]).returning()

    console.log(`✅ Created ${sampleLeads.length} leads`)
    console.log('🎉 Basic seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function
seedBasicData()
  .then(() => {
    console.log('✅ Seeding finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
