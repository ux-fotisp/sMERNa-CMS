"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ListingDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [listing, setListing] = useState<any>(null)

  const runListingAction = async (action: string, reason?: string) => {
    if (!params?.id) {
      return
    }

    const response = await fetch(`/api/listings/${params.id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason }),
    })

    if (response.ok) {
      const refreshed = await fetch(`/api/listings/${params.id}`)
      const data = await refreshed.json()
      setListing(data)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const loadListing = async () => {
      if (!params?.id) {
        return
      }

      const response = await fetch(`/api/listings/${params.id}`)
      const data = await response.json()
      setListing(data)
    }

    loadListing()
  }, [params?.id])

  if (status === 'loading') {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  if (!listing) {
    return <div className="container mx-auto p-4">Listing not found.</div>
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-4">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{listing.title}</CardTitle>
          <CardDescription>
            {listing.status} · {listing.visibility} {listing.featured ? '· featured' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{listing.description}</p>
          {listing.excerpt ? <p className="text-sm text-muted-foreground">{listing.excerpt}</p> : null}
          {listing.contact?.website ? (
            <a className="text-primary underline" href={listing.contact.website} target="_blank" rel="noreferrer">
              Visit Website
            </a>
          ) : null}
          {listing.address?.city ? <p>City: {listing.address.city}</p> : null}
          {listing.listingType ? <p>Type: {listing.listingType}</p> : null}
          {listing.rejectionReason ? <p>Rejection reason: {listing.rejectionReason}</p> : null}
          {listing.approvedAt ? <p>Approved at: {new Date(listing.approvedAt).toLocaleString()}</p> : null}
          {listing.archivedAt ? <p>Archived at: {new Date(listing.archivedAt).toLocaleString()}</p> : null}
          {listing.featuredAt ? <p>Featured at: {new Date(listing.featuredAt).toLocaleString()}</p> : null}
          <div className="flex flex-wrap gap-2 pt-2">
            {listing.status === 'draft' || listing.status === 'rejected' ? (
              <Button variant="outline" onClick={() => runListingAction('submit_for_review')}>
                Submit for Review
              </Button>
            ) : null}
            {session?.user?.role === 'admin' && listing.status === 'pending_review' ? (
              <Button variant="outline" onClick={() => runListingAction('approve')}>
                Approve
              </Button>
            ) : null}
            {session?.user?.role === 'admin' && listing.status === 'pending_review' ? (
              <Button variant="outline" onClick={() => runListingAction('publish')}>
                Publish
              </Button>
            ) : null}
            {session?.user?.role === 'admin' && listing.status === 'pending_review' ? (
              <Button
                variant="outline"
                onClick={() => {
                  const reason = window.prompt('Rejection reason')
                  if (reason) {
                    runListingAction('reject', reason)
                  }
                }}
              >
                Reject
              </Button>
            ) : null}
            {session?.user?.role === 'admin' && listing.featured ? (
              <Button variant="outline" onClick={() => runListingAction('unfeature')}>
                Unfeature
              </Button>
            ) : (
              session?.user?.role === 'admin' && listing.status === 'published' ? (
                <Button variant="outline" onClick={() => runListingAction('feature')}>
                  Feature
                </Button>
              ) : null
            )}
            {listing.status !== 'archived' ? (
              <Button variant="destructive" onClick={() => runListingAction('archive')}>
                Archive
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}