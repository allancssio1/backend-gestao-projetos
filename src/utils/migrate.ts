import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { env } from '../env'

console.log('🔍 Debugging environment variables:')
console.log('DB_HOST:', env.DB_HOST)
console.log('DB_PORT:', env.DB_PORT)
console.log('DB_USER:', env.DB_USER)
console.log('DB_PASSWORD:', env.DB_PASSWORD ? '***' : 'UNDEFINED')
console.log('DB_NAME:', env.DB_NAME)

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
})

const db = drizzle(pool)

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const maxRetries = 5
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(
        `🚀 Starting migrations... (attempt ${i + 1}/${maxRetries})`
      )
      await migrate(db, { migrationsFolder: './dist/models/drizzle' })
      console.log('✅ Migrations completed successfully!')
      await pool.end()
      return
    } catch (error) {
      lastError = error as Error
      console.error(
        `⚠️  Migration attempt ${i + 1} failed:`,
        error instanceof Error ? error.message : error
      )

      if (i < maxRetries - 1) {
        const waitTime = (i + 1) * 2000 // 2s, 4s, 6s, 8s
        console.log(`⏳ Waiting ${waitTime / 1000}s before retry...`)
        await sleep(waitTime)
      }
    }
  }

  console.error('❌ Migration failed after all retries')
  throw lastError
}

main().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
