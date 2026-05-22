import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { listingCreateSchema, validateRequestBody } from '@/lib/validation'
import Listing from '@/models/Listing'

export async function GET(request: Request) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Math.max(Number(searchParams.get('page') ?? '1') || 1, 1)
    const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? '12') || 12, 1), 100)
    const status = searchParams.get('status') ?? ''
    const visibility = searchParams.get('visibility') ?? ''
    const featured = searchParams.get('featured') ?? ''
    const sortBy = searchParams.get('sortBy') ?? 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1
    const search = searchParams.get('search')?.trim() ?? ''

    const filter: Record<string, unknown> = {}

    if (!isAdminSession(session)) {
      filter.submittedBy = session.user.id
    }

    if (status) {
      filter.status = status
    }

    if (visibility) {
      filter.visibility = visibility
    }

    if (featured === 'true') {
      filter.featured = true
    }

    if (featured === 'false') {
      filter.featured = false
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ]
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortOrder,
    }

    const skip = (page - 1) * limit

    const [items, total] = await Promise.all([
      Listing.find(filter)
        .populate('submittedBy', 'name email')
        .populate('approvedBy', 'name email')
        .populate('contentType')
        .populate('categories')
        .populate('tags')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Listing.countDocuments(filter),
    ])

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const validation = await validateRequestBody(request, listingCreateSchema)

  if (!validation.ok) {
    return validation.response
  }

  try {
    await connectDB()

    const listing = new Listing({
      ...validation.data,
      submittedBy: session.user.id,
      updatedBy: session.user.id,
    })

    await listing.save()
    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Error creating listing:', error)
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 })
  }
}