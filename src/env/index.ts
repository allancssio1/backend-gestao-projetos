import { z } from 'zod'

// Em desenvolvimento, carregar .env
// Em produção (Docker), as variáveis vêm do docker-compose.yml
// Se NODE_ENV não está definido OU não é production, carregar .env
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv/config')
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),

  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),

  JWT_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
