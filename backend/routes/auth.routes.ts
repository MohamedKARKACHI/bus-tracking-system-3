import { Router } from 'express'
import pool from '../config/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const [users] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    const user = (users as any[])[0]

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role = 'client' } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, phone, role]
    )

    const userId = (result as any).insertId

    const token = jwt.sign(
      { id: userId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      token,
      user: { id: userId, name, email, role }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
