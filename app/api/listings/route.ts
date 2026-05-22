import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { listingCreateSchema, validateRequestBody } from '@/lib/validation'
import Listing from '@/models/Listing'

export async function GET() {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await connectDB()

    const listings = await Listing.find({})
      .populate('submittedBy', 'name email')
      .populate('approvedBy', 'name email')
      .populate('contentType')
      .populate('categories')
      .populate('tags')
      .sort({ createdAt: -1 })

    return NextResponse.json(listings)
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