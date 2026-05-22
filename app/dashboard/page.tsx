"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    const fetchListings = async () => {
      const res = await fetch("/api/listings")
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    }
    fetchListings()
  }, [])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Listings Dashboard</h1>
      <div className="flex justify-between mb-4">
        <Link href="/listings/new">
          <Button>Create New Listing</Button>
        </Link>
        <Link href="/taxonomy">
          <Button variant="outline">Manage Taxonomy</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing: any) => (
          <Card key={listing._id}>
            <CardHeader>
              <CardTitle>{listing.title}</CardTitle>
              <CardDescription>
                {listing.status} · {listing.visibility}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{listing.excerpt || listing.description.substring(0, 100)}...</p>
            </CardContent>
            <CardFooter>
              <Link href={`/listings/${listing._id}`}>
                <Button>View</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}