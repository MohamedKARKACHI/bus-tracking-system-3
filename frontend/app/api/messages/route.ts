import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const [messages] = await pool.query(
      `SELECT m.*, 
              CONCAT(u.first_name, ' ', u.last_name) as sender_name, 
              u.role as sender_role 
       FROM messages m 
       LEFT JOIN users u ON m.sender_id = u.id 
       ORDER BY m.sent_at DESC 
       LIMIT 50`
    )
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error("Failed to fetch messages:", error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sender_id, receiver_id, message, subject, priority = "normal" } = body

    if (!sender_id || !message) {
      return NextResponse.json(
        { error: "sender_id and message are required" },
        { status: 400 }
      )
    }

    const [result] = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, subject, message, sent_at) 
       VALUES (?, ?, ?, ?, NOW())`,
      [sender_id, receiver_id || null, subject || null, message]
    )

    return NextResponse.json(
      { 
        success: true, 
        message: "Message sent successfully",
        id: (result as any).insertId 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to send message:", error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
