import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { listingActionSchema, validateRequestBody } from '@/lib/validation'
import Listing from '@/models/Listing'

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const validation = await validateRequestBody(request, listingActionSchema)

  if (!validation.ok) {
    return validation.response
  }

  await connectDB()

  const listing = await Listing.findById(params.id)

  if (!listing) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
  }

  if (!isAdminSession(session) && listing.submittedBy?.toString() !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const commonUpdate = { updatedBy: session.user.id, updatedAt: now }

  switch (validation.data.action) {
    case 'submit_for_review':
      if (!['draft', 'rejected'].includes(listing.status)) {
        return NextResponse.json({ error: 'Only draft or rejected listings can be submitted for review' }, { status: 400 })
      }

      listing.status = 'pending_review'
      listing.rejectionReason = undefined
      listing.rejectedAt = undefined
      break
    case 'approve':
      if (!isAdminSession(session)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      listing.approvedBy = session.user.id as never
      listing.approvedAt = now
      break
    case 'reject':
      if (!isAdminSession(session)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      listing.status = 'rejected'
      listing.rejectedBy = session.user.id as never
      listing.rejectedAt = now
      listing.rejectionReason = validation.data.reason
      listing.featured = false
      listing.featuredAt = undefined
      listing.featuredBy = undefined
      break
    case 'publish':
      if (!isAdminSession(session)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      listing.status = 'published'
      listing.publishedAt = listing.publishedAt ?? now
      break
    case 'archive':
      if (!isAdminSession(session) && listing.submittedBy?.toString() !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      listing.status = 'archived'
      listing.archivedAt = now
      listing.featured = false
      listing.featuredAt = undefined
      listing.featuredBy = undefined
      break
    case 'feature':
      if (!isAdminSession(session)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      if (listing.status !== 'published') {
        return NextResponse.json({ error: 'Only published listings can be featured' }, { status: 400 })
      }

      listing.featured = true
      listing.featuredAt = now
      listing.featuredBy = session.user.id as never
      break
    case 'unfeature':
      if (!isAdminSession(session)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      listing.featured = false
      listing.featuredAt = undefined
      listing.featuredBy = undefined
      break
    default:
      return NextResponse.json({ error: 'Unsupported listing action' }, { status: 400 })
  }

  Object.assign(listing, commonUpdate)
  await listing.save()

  return NextResponse.json(listing)
}