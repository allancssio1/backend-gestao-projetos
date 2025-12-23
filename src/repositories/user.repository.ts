import { eq } from 'drizzle-orm';
import { db } from '../utils/db';
import { users } from '../models/schema';

export const userRepository = {
  async create(data: { name: string; email: string; password: string }) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },
};
