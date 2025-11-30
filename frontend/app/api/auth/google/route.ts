import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import mysql from "mysql2/promise"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

const dbConfig = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "8889"),
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "root",
  database: process.env.DATABASE_NAME || "bus_tracking_system",
  socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
}

export async function POST(request: Request) {
  try {
    const { credential, client_id } = await request.json()

    if (!credential) {
      return NextResponse.json({ error: "No credential provided" }, { status: 400 })
    }

    // Decode the JWT token from Google
    const base64Url = credential.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join("")
    )

    const googleUser = JSON.parse(jsonPayload)

    // Verify the token is from Google
    if (!googleUser.email || !googleUser.email_verified) {
      return NextResponse.json({ error: "Invalid Google token" }, { status: 400 })
    }

    // Connect to database
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Check if user exists
      const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [googleUser.email])

      let user
      let userId

      if (Array.isArray(rows) && rows.length > 0) {
        // User exists - update their info
        user = rows[0] as any
        userId = user.id

        // Update user info from Google
        await connection.execute(
          "UPDATE users SET first_name = ?, last_name = ?, avatar = ? WHERE id = ?",
          [googleUser.given_name || user.first_name, googleUser.family_name || user.last_name, googleUser.picture, userId]
        )
      } else {
        // Create new user
        const [result] = await connection.execute(
          "INSERT INTO users (email, first_name, last_name, password, role, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
          [
            googleUser.email,
            googleUser.given_name || "User",
            googleUser.family_name || "",
            await bcrypt.hash(Math.random().toString(36), 10), // Random password for OAuth users
            "client",
            googleUser.picture,
          ]
        )

        userId = (result as any).insertId

        // Fetch the newly created user
        const [newUserRows] = await connection.execute("SELECT * FROM users WHERE id = ?", [userId])
        user = (newUserRows as any[])[0]
      }

      // Normalize role to lowercase to match frontend expectations
      const normalizedRole = String(user.role).toLowerCase() as 'admin' | 'driver' | 'client'

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: normalizedRole,
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      )

      return NextResponse.json({
        token,
        user: {
          id: user.id.toString(),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`.trim(),
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name + " " + user.last_name)}&background=3B82F6&color=fff`,
          role: normalizedRole,
        },
      })
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
