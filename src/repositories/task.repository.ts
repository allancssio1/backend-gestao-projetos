import { eq, and } from 'drizzle-orm';
import { db } from '../utils/db';
import { tasks, projects } from '../models/schema';

export const taskRepository = {
  async create(data: { title: string; projectId: string }) {
    const [task] = await db.insert(tasks).values(data).returning();
    return task;
  },

  async findByProjectId(projectId: string) {
    return db.select().from(tasks).where(eq(tasks.projectId, projectId));
  },

  async findById(id: string) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  },

  async findByIdWithProject(id: string) {
    const [result] = await db
      .select({
        task: tasks,
        project: projects,
      })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(tasks.id, id));
    return result;
  },

  async update(id: string, data: { title?: string; completed?: boolean }) {
    const [task] = await db.update(tasks).set(data).where(eq(tasks.id, id)).returning();
    return task;
  },

  async delete(id: string) {
    const [task] = await db.delete(tasks).where(eq(tasks.id, id)).returning();
    return task;
  },
};
