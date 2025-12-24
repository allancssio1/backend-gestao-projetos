import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod/v4'
import { authService } from '../services/auth.service'

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.email(),
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
        console.log('🚀 ~ error._zod.output:', error._zod.output)
        reply.status(400).send({ error: error._zod.output })
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
      reply.send({ token })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('🚀 ~ error._zod.output:', error._zod.output)
        reply.status(400).send({ error: error._zod.output })
      } else if (error instanceof Error) {
        reply.status(401).send({ error: error.message })
      } else {
        reply.status(500).send({ error: 'Internal server error' })
      }
    }
  },
}
