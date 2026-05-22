import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { taxonomySchema, validateRequestBody } from '@/lib/validation'
import Category from '@/models/Category'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const category = await Category.findById(params.id).populate('parent')

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  return NextResponse.json(category)
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

  const category = await Category.findByIdAndUpdate(params.id, validation.data, {
    new: true,
    runValidators: true,
  })

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  return NextResponse.json(category)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const category = await Category.findByIdAndDelete(params.id)

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  return NextResponse.json({ message: 'Category deleted successfully' })
}