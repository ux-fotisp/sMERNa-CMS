import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { taxonomySchema, validateRequestBody } from '@/lib/validation'
import Tag from '@/models/Tag'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const tag = await Tag.findById(params.id)

  if (!tag) {
    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  }

  return NextResponse.json(tag)
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

  const tag = await Tag.findByIdAndUpdate(params.id, validation.data, {
    new: true,
    runValidators: true,
  })

  if (!tag) {
    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  }

  return NextResponse.json(tag)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const tag = await Tag.findByIdAndDelete(params.id)

  if (!tag) {
    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Tag deleted successfully' })
}