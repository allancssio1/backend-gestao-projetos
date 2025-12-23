import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { taskService } from '../services/task.service';

const createTaskSchema = z.object({
  title: z.string().min(1),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

const projectIdSchema = z.object({
  id: z.string().uuid(),
});

const taskIdSchema = z.object({
  id: z.string().uuid(),
});

export const taskController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: projectId } = projectIdSchema.parse(request.params);
      const data = createTaskSchema.parse(request.body);
      const userId = (request.user as { id: string }).id;
      const task = await taskService.create({ ...data, projectId }, userId);
      reply.status(201).send(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors });
      } else if (error instanceof Error) {
        reply.status(404).send({ error: error.message });
      } else {
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  },

  async listByProject(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id: projectId } = projectIdSchema.parse(request.params);
      const userId = (request.user as { id: string }).id;
      const tasks = await taskService.findByProjectId(projectId, userId);
      reply.send(tasks);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors });
      } else if (error instanceof Error) {
        reply.status(404).send({ error: error.message });
      } else {
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = taskIdSchema.parse(request.params);
      const data = updateTaskSchema.parse(request.body);
      const userId = (request.user as { id: string }).id;
      const task = await taskService.update(id, userId, data);
      reply.send(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors });
      } else if (error instanceof Error) {
        reply.status(404).send({ error: error.message });
      } else {
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = taskIdSchema.parse(request.params);
      const userId = (request.user as { id: string }).id;
      await taskService.delete(id, userId);
      reply.status(204).send();
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors });
      } else if (error instanceof Error) {
        reply.status(404).send({ error: error.message });
      } else {
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  },
};
