import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { validateAuthInput } from '../middleware/validation';

const router = express.Router();

// Register a new user
router.post('/register', validateAuthInput, async (req, res) => {
  try {
    const { email, password, name, company } = req.body;
    
    // Check if user already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const userId = uuidv4();
    const result = await db.query(
      `INSERT INTO users (id, email, password_hash, name, company, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING id, email, name, company`,
      [userId, email, hashedPassword, name, company]
    );
    
    // Create subscription
    await db.query(
      `INSERT INTO subscriptions (user_id, tier, status, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [userId, 'Starter', 'trial']
    );
    
    // Generate JWT
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        company: result.rows[0].company,
        subscription: {
          tier: 'Starter',
          status: 'trial'
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login user
router.post('/login', validateAuthInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await db.query(
      `SELECT u.*, s.tier, s.status
       FROM users u
       JOIN subscriptions s ON u.id = s.user_id
       WHERE u.email = $1`,
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        subscription: {
          tier: user.tier,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    
    const result = await db.query(
      `SELECT u.*, s.tier, s.status
       FROM users u
       JOIN subscriptions s ON u.id = s.user_id
       WHERE u.id = $1`,
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = result.rows[0];
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        subscription: {
          tier: user.tier,
          status: user.status
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error getting user' });
  }
});

export default router; 