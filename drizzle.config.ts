import type { Config } from 'drizzle-kit'
import 'dotenv'

export default {
  schema: './src/models/schema.ts',
  out: './src/models/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'gestao_projetos',
    ssl: false,
  },
} satisfies Config
