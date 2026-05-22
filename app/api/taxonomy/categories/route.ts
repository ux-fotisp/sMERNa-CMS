import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { taxonomySchema, validateRequestBody } from '@/lib/validation'
import Category from '@/models/Category'

export async function GET() {
  const session = await getCurrentSession()

  if (!session || !isAdminSession(session)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await connectDB()
    const categories = await Category.find({}).populate('parent')
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
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
    const category = new Category(validation.data)
    await category.save()
    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}