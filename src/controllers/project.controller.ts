import { FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { projectService } from '../services/project.service';

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const projectIdSchema = z.object({
  id: z.string().uuid(),
});

export const projectController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const data = createProjectSchema.parse(request.body);
      const userId = (request.user as { id: string }).id;
      const project = await projectService.create({ ...data, ownerId: userId });
      reply.status(201).send(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({ error: error.errors });
      } else {
        reply.status(500).send({ error: 'Internal server error' });
      }
    }
  },

  async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as { id: string }).id;
      const projects = await projectService.findByUserId(userId);
      reply.send(projects);
    } catch (error) {
      reply.status(500).send({ error: 'Internal server error' });
    }
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = projectIdSchema.parse(request.params);
      const userId = (request.user as { id: string }).id;
      const project = await projectService.findById(id, userId);
      reply.send(project);
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
      const { id } = projectIdSchema.parse(request.params);
      const data = updateProjectSchema.parse(request.body);
      const userId = (request.user as { id: string }).id;
      const project = await projectService.update(id, userId, data);
      reply.send(project);
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
      const { id } = projectIdSchema.parse(request.params);
      const userId = (request.user as { id: string }).id;
      await projectService.delete(id, userId);
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
