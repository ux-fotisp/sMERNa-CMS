import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { contentCreateSchema, validateRequestBody } from '@/lib/validation'
import Content from '@/models/Content'

export async function GET() {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const query = isAdminSession(session) ? {} : { author: session.user.id }

    const contents = await Content.find(query)
      .populate('author', 'name email')
      .populate('contentType')
      .populate('categories')
      .populate('tags')

    return NextResponse.json(contents)
  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json({ error: 'Failed to fetch contents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const validation = await validateRequestBody(request, contentCreateSchema)

  if (!validation.ok) {
    return validation.response
  }

  try {
    await connectDB()

    const content = new Content({
      ...validation.data,
      author: session.user.id,
    })

    await content.save()
    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}