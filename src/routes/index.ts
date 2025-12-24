import { FastifyInstance } from 'fastify'
import { authRoutes } from './auth.routes'
import { projectRoutes } from './project.routes'
import { taskRoutes } from './task.routes'
import { taskController } from '../controllers/task.controller'
import { authenticate } from '../middlewares/auth.middleware'

export async function routes(fastify: FastifyInstance) {
  fastify.register(authRoutes, { prefix: '/auth' })
  fastify.register(projectRoutes, { prefix: '/projects' })
  fastify.register(taskRoutes, { prefix: '/tasks' })
}
