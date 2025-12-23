import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { authService } from '../services/auth.service'

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const authController = {
  async register(request: FastifyRequest, reply: FastifyReply) {
    console.log('🚀 ~ request:', request)
    try {
      const data = registerSchema.parse(request.body)
      const user = await authService.register(data)
      reply.status(201).send(user)
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors })
      } else if (error instanceof Error) {
        reply.status(400).send({ error: error.message })
      } else {
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = loginSchema.parse(request.body)
      const user = await authService.login(email, password)
      const token = request.server.jwt.sign({ id: user.id })
      reply.send({ user, token })
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors })
      } else if (error instanceof Error) {
        reply.status(401).send({ error: error.message })
      } else {
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  },
}
