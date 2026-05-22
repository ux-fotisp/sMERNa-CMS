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
            {listing.status} · {listing.visibility}
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
        </CardContent>
      </Card>
    </div>
  )
}