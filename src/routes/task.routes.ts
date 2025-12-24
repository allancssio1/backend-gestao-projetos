import { FastifyInstance } from 'fastify'
import { taskController } from '../controllers/task.controller'
import { authenticate } from '../middlewares/auth.middleware'

export async function taskRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate)

  fastify.put('/:id', taskController.update)
  fastify.delete('/:id', taskController.delete)
}
