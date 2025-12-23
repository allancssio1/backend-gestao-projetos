import { projectRepository } from '../repositories/project.repository';

export const projectService = {
  async create(data: { name: string; description?: string; ownerId: string }) {
    return projectRepository.create(data);
  },

  async findByUserId(userId: string) {
    return projectRepository.findByUserId(userId);
  },

  async findById(id: string, userId: string) {
    const project = await projectRepository.findByIdAndUserId(id, userId);

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  async update(id: string, userId: string, data: { name?: string; description?: string }) {
    const project = await projectRepository.update(id, userId, data);

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },

  async delete(id: string, userId: string) {
    const project = await projectRepository.delete(id, userId);

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  },
};
