import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { queries } from '../queries';
import { logToFile } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SALT_ROUNDS = 10;

export const authService = {
  register: async (email: string, password: string) => {
    try {
      // Check if user already exists
      const existingUser = await queries.getUserByEmail(email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const user = await queries.createUser(email, passwordHash);

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      return { user, token };
    } catch (error) {
      logToFile('error', `Registration error: ${error.message}`);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      // Get user
      const user = await queries.getUserByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      return { 
        user: { 
          id: user.id, 
          email: user.email 
        }, 
        token 
      };
    } catch (error) {
      logToFile('error', `Login error: ${error.message}`);
      throw error;
    }
  },

  verifyToken: (token: string) => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      logToFile('error', `Token verification error: ${error.message}`);
      throw new Error('Invalid token');
    }
  }
}; 