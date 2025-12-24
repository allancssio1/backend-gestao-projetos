import { FastifyInstance } from 'fastify'
import { projectController } from '../controllers/project.controller'
import { authenticate } from '../middlewares/auth.middleware'
import { taskController } from '../controllers/task.controller'

export async function projectRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', authenticate)

  fastify.get('/', projectController.list)
  fastify.post('/', projectController.create)
  fastify.get('/:id', projectController.getById)
  fastify.put('/:id', projectController.update)
  fastify.delete('/:id', projectController.delete)
  fastify.get('/:id/tasks', taskController.listByProject)
  fastify.post('/:id/tasks', taskController.create)
}
