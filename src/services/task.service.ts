import { taskRepository } from '../repositories/task.repository';
import { projectRepository } from '../repositories/project.repository';

export const taskService = {
  async create(data: { title: string; projectId: string }, userId: string) {
    const project = await projectRepository.findByIdAndUserId(data.projectId, userId);

    if (!project) {
      throw new Error('Project not found');
    }

    return taskRepository.create(data);
  },

  async findByProjectId(projectId: string, userId: string) {
    const project = await projectRepository.findByIdAndUserId(projectId, userId);

    if (!project) {
      throw new Error('Project not found');
    }

    return taskRepository.findByProjectId(projectId);
  },

  async update(id: string, userId: string, data: { title?: string; completed?: boolean }) {
    const taskWithProject = await taskRepository.findByIdWithProject(id);

    if (!taskWithProject) {
      throw new Error('Task not found');
    }

    if (taskWithProject.project.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    return taskRepository.update(id, data);
  },

  async delete(id: string, userId: string) {
    const taskWithProject = await taskRepository.findByIdWithProject(id);

    if (!taskWithProject) {
      throw new Error('Task not found');
    }

    if (taskWithProject.project.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    return taskRepository.delete(id);
  },
};
