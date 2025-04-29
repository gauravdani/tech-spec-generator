import { db } from './db';

export const queries = {
  createUser: async (email: string, passwordHash: string) => {
    const result = await db.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );
    return result.rows[0];
  },

  getUserByEmail: async (email: string) => {
    const result = await db.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  },

  getUserById: async (id: string) => {
    const result = await db.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}; 