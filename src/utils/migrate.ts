import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import { env } from '../env'

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
})

const db = drizzle(pool)

async function main() {
  // console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' })
  // console.log('Migrations completed!');
  await pool.end()
}

main()
