import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { env } from './env'
import { routes } from './routes'

const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1d',
  },
})

app.register(routes)

app.get('/', async () => {
  return { hello: 'world' }
})

app.listen({ port: env.PORT, host: env.HOST }, (err) => {
  if (err) {
    console.error(err)
  }
  console.log(`🚀 ~ Server listening `)
})
