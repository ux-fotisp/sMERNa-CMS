import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { taxonomySchema, validateRequestBody } from '@/lib/validation'
import ContentType from '@/models/ContentType'

export async function GET() {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await connectDB()
    const contentTypes = await ContentType.find({})
    return NextResponse.json(contentTypes)
  } catch (error) {
    console.error('Error fetching content types:', error)
    return NextResponse.json({ error: 'Failed to fetch content types' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const validation = await validateRequestBody(request, taxonomySchema)

  if (!validation.ok) {
    return validation.response
  }

  try {
    await connectDB()
    const contentType = new ContentType(validation.data)
    await contentType.save()
    return NextResponse.json(contentType, { status: 201 })
  } catch (error) {
    console.error('Error creating content type:', error)
    return NextResponse.json({ error: 'Failed to create content type' }, { status: 500 })
  }
}