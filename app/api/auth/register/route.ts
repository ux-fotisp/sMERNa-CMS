import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from "@/lib/db"
import { registrationSchema, validateRequestBody } from "@/lib/validation"
import User from "@/models/User"

export async function POST(request: Request) {
  const validation = await validateRequestBody(request, registrationSchema)

  if (!validation.ok) {
    return validation.response
  }

  try {
    await connectDB()

    const { name, email, password } = validation.data

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    })

    await user.save()

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}