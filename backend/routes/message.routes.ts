import { Router } from 'express'
import pool from '../config/database'
import { AuthRequest } from '../middleware/auth.middleware'

const router = Router()

// Get conversations for the current user
router.get('/conversations', async (req: any, res) => {
  try {
    const userId = req.user.id

    // Get all messages involving the user
    const [messages] = await pool.query(`
      SELECT 
        m.*,
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id 
          ELSE m.sender_id 
        END as other_user_id,
        u.name as other_user_name,
        u.role as other_user_role
      FROM messages m
      JOIN users u ON (
        (m.sender_id = ? AND m.receiver_id = u.id) OR 
        (m.receiver_id = ? AND m.sender_id = u.id)
      )
      ORDER BY m.sent_at DESC
    `, [userId, userId, userId])

    // Group by other_user_id to get unique conversations
    const conversationsMap = new Map()
    
    ;(messages as any[]).forEach(msg => {
      if (!conversationsMap.has(msg.other_user_id)) {
        conversationsMap.set(msg.other_user_id, {
          id: msg.other_user_id.toString(),
          name: msg.other_user_name,
          avatar: msg.other_user_name.substring(0, 2).toUpperCase(), // Simple avatar
          lastMessage: msg.message,
          time: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: 0, // TODO: Calculate unread count
          online: true, // TODO: Check online status
          messages: [] // We'll fetch messages separately or populate here if needed
        })
      }
    })

    res.json(Array.from(conversationsMap.values()))
  } catch (error) {
    console.error('Error fetching conversations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get messages with a specific user
router.get('/:userId', async (req: any, res) => {
  try {
    const currentUserId = req.user.id
    const otherUserId = req.params.userId

    const [messages] = await pool.query(`
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY sent_at ASC
    `, [currentUserId, otherUserId, otherUserId, currentUserId])

    res.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Send a message
router.post('/', async (req: any, res) => {
  try {
    const sender_id = req.user.id
    const { receiver_id, message } = req.body

    const [result] = await pool.query(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message]
    )
    
    res.status(201).json({ id: (result as any).insertId, sender_id, receiver_id, message, sent_at: new Date() })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
