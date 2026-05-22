import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { listingUpdateSchema, validateRequestBody } from '@/lib/validation'
import Listing from '@/models/Listing'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const listing = await Listing.findById(params.id)
    .populate('submittedBy', 'name email')
    .populate('approvedBy', 'name email')
    .populate('contentType')
    .populate('categories')
    .populate('tags')

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (!isAdminSession(session) && listing.submittedBy?.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(listing)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const validation = await validateRequestBody(request, listingUpdateSchema)

  if (!validation.ok) {
    return validation.response
  }

  await connectDB()

  const existingListing = await Listing.findById(params.id)

  if (!existingListing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (!isAdminSession(session) && existingListing.submittedBy?.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updatedListing = await Listing.findByIdAndUpdate(
    params.id,
    {
      ...validation.data,
      updatedBy: session.user.id,
      updatedAt: Date.now(),
    },
    { new: true, runValidators: true }
  )

  return NextResponse.json(updatedListing)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const listing = await Listing.findById(params.id)

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (!isAdminSession(session) && listing.submittedBy?.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await Listing.findByIdAndUpdate(
    params.id,
    {
      status: 'archived',
      archivedAt: new Date(),
      updatedBy: session.user.id,
      updatedAt: Date.now(),
      featured: false,
      featuredAt: null,
      featuredBy: null,
    },
    { new: true, runValidators: true }
  )

  return NextResponse.json({ message: 'Listing archived successfully' })
}