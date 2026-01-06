import postgres from 'postgres'

// Load environment variables for Node.js scripts
if (typeof window === 'undefined') {
  // Server-side: load dotenv
  const dotenv = require('dotenv')
  dotenv.config({ path: '.env.local' })
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not defined. Current process.env:')
  console.error('Available keys:', Object.keys(process.env).filter(k => k.includes('DATABASE')))
  throw new Error('DATABASE_URL is not defined in environment variables')
}

console.log('Database URL configured:', process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ':****@'))

const sql = postgres(process.env.DATABASE_URL)

export default sql