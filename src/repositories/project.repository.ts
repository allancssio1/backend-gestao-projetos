import { eq, and } from 'drizzle-orm';
import { db } from '../utils/db';
import { projects } from '../models/schema';

export const projectRepository = {
  async create(data: { name: string; description?: string; ownerId: string }) {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  },

  async findByUserId(userId: string) {
    return db.select().from(projects).where(eq(projects.ownerId, userId));
  },

  async findById(id: string) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  },

  async findByIdAndUserId(id: string, userId: string) {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.ownerId, userId)));
    return project;
  },

  async update(id: string, userId: string, data: { name?: string; description?: string }) {
    const [project] = await db
      .update(projects)
      .set(data)
      .where(and(eq(projects.id, id), eq(projects.ownerId, userId)))
      .returning();
    return project;
  },

  async delete(id: string, userId: string) {
    const [project] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.ownerId, userId)))
      .returning();
    return project;
  },
};
