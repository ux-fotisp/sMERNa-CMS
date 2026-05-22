import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { getCurrentSession, isAdminSession } from '@/lib/access'
import { validateRequestBody } from '@/lib/validation'
import { z } from 'zod'
import Listing from '@/models/Listing'

const bulkActionSchema = z.object({
  action: z.enum(['archive', 'publish', 'feature', 'unfeature']),
  ids: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid identifier')).min(1),
})

export async function POST(request: Request) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const validation = await validateRequestBody(request, bulkActionSchema)

  if (!validation.ok) {
    return validation.response
  }

  if (!isAdminSession(session) && validation.data.action !== 'archive') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await connectDB()

  const now = new Date()
  const baseFilter = isAdminSession(session)
    ? { _id: { $in: validation.data.ids } }
    : { _id: { $in: validation.data.ids }, submittedBy: session.user.id }

  let update: Record<string, unknown> = { updatedBy: session.user.id, updatedAt: now }

  if (validation.data.action === 'archive') {
    update = { ...update, status: 'archived', archivedAt: now, featured: false, featuredAt: null, featuredBy: null }
  }

  if (validation.data.action === 'publish') {
    update = { ...update, status: 'published', publishedAt: now }
  }

  if (validation.data.action === 'feature') {
    update = { ...update, featured: true, featuredAt: now, featuredBy: session.user.id }
  }

  if (validation.data.action === 'unfeature') {
    update = { ...update, featured: false, featuredAt: null, featuredBy: null }
  }

  const result = await Listing.updateMany(baseFilter, { $set: update })

  return NextResponse.json({
    message: 'Bulk action completed',
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  })
}