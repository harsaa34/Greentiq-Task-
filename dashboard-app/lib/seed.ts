import sql from './db'

async function seedDatabase() {
  try {
    console.log('Seeding database...')
    
    // Create leads table
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        sale_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        stage VARCHAR(100) NOT NULL,
        stage_percentage INTEGER NOT NULL,
        sale_date DATE DEFAULT CURRENT_DATE,
        next_activity_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Check if table has data
    const existingLeads = await sql`SELECT COUNT(*) as count FROM leads`
    const count = parseInt(existingLeads[0].count)

    if (count === 0) {
      // Insert sample data
      const sampleLeads = [
        {
          sale_name: 'Enterprise Software License',
          status: 'Open',
          amount: 50000.00,
          stage: 'Proposal',
          stage_percentage: 60,
          sale_date: '2024-01-15',
          next_activity_date: '2024-01-30',
        },
        {
          sale_name: 'Cloud Migration Project',
          status: 'Sold',
          amount: 120000.00,
          stage: 'Closed Won',
          stage_percentage: 100,
          sale_date: '2024-01-10',
          next_activity_date: '2024-02-15',
        },
        {
          sale_name: 'Consulting Services',
          status: 'Stalled',
          amount: 25000.00,
          stage: 'Negotiation',
          stage_percentage: 40,
          sale_date: '2024-01-05',
          next_activity_date: '2024-01-20',
        },
        {
          sale_name: 'Annual Support Contract',
          status: 'Open',
          amount: 75000.00,
          stage: 'Qualification',
          stage_percentage: 30,
          sale_date: '2024-01-18',
          next_activity_date: '2024-02-01',
        },
        {
          sale_name: 'Hardware Upgrade',
          status: 'Lost',
          amount: 45000.00,
          stage: 'Closed Lost',
          stage_percentage: 100,
          sale_date: '2023-12-20',
          next_activity_date: '2024-01-05',
        },
        {
          sale_name: 'Training Program',
          status: 'Open',
          amount: 18000.00,
          stage: 'Discovery',
          stage_percentage: 20,
          sale_date: '2024-01-20',
          next_activity_date: '2024-02-05',
        },
        {
          sale_name: 'API Integration',
          status: 'Sold',
          amount: 35000.00,
          stage: 'Closed Won',
          stage_percentage: 100,
          sale_date: '2024-01-12',
          next_activity_date: '2024-01-25',
        },
        {
          sale_name: 'Security Audit',
          status: 'Open',
          amount: 42000.00,
          stage: 'Qualification',
          stage_percentage: 35,
          sale_date: '2024-01-22',
          next_activity_date: '2024-02-10',
        },
        {
          sale_name: 'Mobile App Development',
          status: 'Stalled',
          amount: 85000.00,
          stage: 'Negotiation',
          stage_percentage: 55,
          sale_date: '2024-01-08',
          next_activity_date: '2024-01-25',
        },
        {
          sale_name: 'Data Analytics Platform',
          status: 'Open',
          amount: 95000.00,
          stage: 'Proposal',
          stage_percentage: 65,
          sale_date: '2024-01-25',
          next_activity_date: '2024-02-15',
        },
      ]

      for (const lead of sampleLeads) {
        await sql`
          INSERT INTO leads (sale_name, status, amount, stage, stage_percentage, sale_date, next_activity_date)
          VALUES (
            ${lead.sale_name},
            ${lead.status},
            ${lead.amount},
            ${lead.stage},
            ${lead.stage_percentage},
            ${lead.sale_date},
            ${lead.next_activity_date}
          )
        `
      }

      console.log('✅ Database seeded with 10 sample leads')
    } else {
      console.log(`✅ Database already has ${count} leads`)
    }

    await sql.end()
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  seedDatabase()
}

export { seedDatabase }