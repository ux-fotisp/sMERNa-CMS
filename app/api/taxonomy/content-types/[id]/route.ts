import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { taxonomySchema, validateRequestBody } from '@/lib/validation'
import ContentType from '@/models/ContentType'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const contentType = await ContentType.findById(params.id)

  if (!contentType) {
    return NextResponse.json({ error: 'Content Type not found' }, { status: 404 })
  }

  return NextResponse.json(contentType)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const validation = await validateRequestBody(request, taxonomySchema)

  if (!validation.ok) {
    return validation.response
  }

  await connectDB()

  const contentType = await ContentType.findByIdAndUpdate(params.id, validation.data, {
    new: true,
    runValidators: true,
  })

  if (!contentType) {
    return NextResponse.json({ error: 'Content Type not found' }, { status: 404 })
  }

  return NextResponse.json(contentType)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const contentType = await ContentType.findByIdAndDelete(params.id)

  if (!contentType) {
    return NextResponse.json({ error: 'Content Type not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Content Type deleted successfully' })
}