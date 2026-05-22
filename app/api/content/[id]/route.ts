import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { contentUpdateSchema, validateRequestBody } from '@/lib/validation'
import Content from '@/models/Content'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const content = await Content.findById(params.id).populate('author', 'name email')

  if (!content) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  if (!isAdminSession(session) && content.author.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(content)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const validation = await validateRequestBody(request, contentUpdateSchema)

  if (!validation.ok) {
    return validation.response
  }

  await connectDB()

  const existingContent = await Content.findById(params.id)

  if (!existingContent) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  if (!isAdminSession(session) && existingContent.author.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updatedContent = await Content.findByIdAndUpdate(
    params.id,
    {
      ...validation.data,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true }
  )

  return NextResponse.json(updatedContent)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const existingContent = await Content.findById(params.id)

  if (!existingContent) {
    return NextResponse.json({ error: 'Content not found' }, { status: 404 })
  }

  if (!isAdminSession(session) && existingContent.author.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await Content.findByIdAndDelete(params.id)

  return NextResponse.json({ message: 'Content deleted successfully' })
}