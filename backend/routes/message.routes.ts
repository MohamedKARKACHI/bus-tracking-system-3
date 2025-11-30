import { Router } from 'express'
import pool from '../config/database'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const [messages] = await pool.query(`
      SELECT 
        m.*,
        u1.name as sender_name,
        u2.name as receiver_name
      FROM messages m
      LEFT JOIN users u1 ON m.sender_id = u1.id
      LEFT JOIN users u2 ON m.receiver_id = u2.id
      ORDER BY m.sent_at DESC
    `)
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body
    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message]
    )
    res.status(201).json({ id: (result as any).insertId })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
