import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'lg-art-secret-key-2026'

function getPrisma() {
  return new PrismaClient()
}

// Default admin credentials for when DB is not available
const DEFAULT_ADMIN = {
  id: 1,
  username: 'admin',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
  name: 'Luci García',
  role: 'admin',
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    let user = null

    try {
      const prisma = getPrisma()
      user = await prisma.user.findUnique({
        where: { username },
      })
    } catch (dbError) {
      // Database not available, use default admin
      if (username === 'admin') {
        user = DEFAULT_ADMIN
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    let validPassword = false
    try {
      validPassword = await bcrypt.compare(password, user.password)
    } catch {
      // If bcrypt fails, check direct match for default user
      validPassword = password === 'admin123'
    }

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Contraseña incorrecta' },
        { status: 401 }
      )
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error del servidor' },
      { status: 500 }
    )
  }
}
