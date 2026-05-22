"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<any[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')
  const [featuredFilter, setFeaturedFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const query = useMemo(() => {
    const params = new URLSearchParams()

    params.set('page', String(pagination.page))
    params.set('limit', String(pagination.limit))
    if (search.trim()) params.set('search', search.trim())
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (visibilityFilter !== 'all') params.set('visibility', visibilityFilter)
    if (featuredFilter !== 'all') params.set('featured', featuredFilter)
    params.set('sortBy', sortBy)
    params.set('sortOrder', sortOrder)

    return params.toString()
  }, [pagination.page, pagination.limit, search, statusFilter, visibilityFilter, featuredFilter, sortBy, sortOrder])

  const fetchListings = async () => {
    setLoading(true)
    const res = await fetch(`/api/listings?${query}`)
    const data = await res.json()
    setListings(Array.isArray(data?.items) ? data.items : [])
    setPagination((current) => ({ ...current, ...(data?.pagination ?? {}) }))
    setLoading(false)
    setSelectedIds([])
  }

  const runListingAction = async (id: string, action: string, reason?: string) => {
    const response = await fetch(`/api/listings/${id}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reason }),
    })

    if (response.ok) {
      await fetchListings()
    }
  }

  const runBulkAction = async (action: 'archive' | 'publish' | 'feature' | 'unfeature') => {
    if (!selectedIds.length) return

    const response = await fetch('/api/listings/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids: selectedIds }),
    })

    if (response.ok) {
      await fetchListings()
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  useEffect(() => {
    fetchListings()
  }, [query])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Listings Dashboard</h1>
      <div className="flex flex-col gap-3 mb-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5 flex-1">
          <Input placeholder="Search listings" value={search} onChange={(event) => setSearch(event.target.value)} />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending_review">Pending review</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
            <SelectTrigger><SelectValue placeholder="Visibility" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger><SelectValue placeholder="Featured" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All featured states</SelectItem>
              <SelectItem value="true">Featured only</SelectItem>
              <SelectItem value="false">Not featured</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger><SelectValue placeholder="Sort by" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="updatedAt">Updated</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="publishedAt">Published</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger><SelectValue placeholder="Order" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Link href="/listings/new">
          <Button>Create New Listing</Button>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/explore/listings">
          <Button variant="outline">View Public Catalog</Button>
        </Link>
        <Button variant="outline" onClick={() => runBulkAction('archive')} disabled={!selectedIds.length}>
          Archive Selected
        </Button>
        {session?.user?.role === 'admin' ? (
          <>
            <Button variant="outline" onClick={() => runBulkAction('publish')} disabled={!selectedIds.length}>
              Publish Selected
            </Button>
            <Button variant="outline" onClick={() => runBulkAction('feature')} disabled={!selectedIds.length}>
              Feature Selected
            </Button>
            <Button variant="outline" onClick={() => runBulkAction('unfeature')} disabled={!selectedIds.length}>
              Unfeature Selected
            </Button>
          </>
        ) : null}
        <Link href="/taxonomy">
          <Button variant="outline">Manage Taxonomy</Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">
                <input
                  type="checkbox"
                  checked={listings.length > 0 && selectedIds.length === listings.length}
                  onChange={(event) => setSelectedIds(event.target.checked ? listings.map((listing) => listing._id) : [])}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Listing</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Visibility</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Featured</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-background">
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={6}>Loading listings...</td></tr>
            ) : listings.length ? (
              listings.map((listing: any) => {
                const checked = selectedIds.includes(listing._id)

                return (
                  <tr key={listing._id}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          setSelectedIds((current) =>
                            event.target.checked
                              ? [...current, listing._id]
                              : current.filter((id) => id !== listing._id)
                          )
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{listing.title}</div>
                      <div className="text-sm text-muted-foreground">{listing.excerpt || listing.description.substring(0, 100)}...</div>
                    </td>
                    <td className="px-4 py-3">{listing.status}</td>
                    <td className="px-4 py-3">{listing.visibility}</td>
                    <td className="px-4 py-3">{listing.featured ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link href={`/listings/${listing._id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                        {listing.status === 'draft' || listing.status === 'rejected' ? (
                          <Button size="sm" variant="outline" onClick={() => runListingAction(listing._id, 'submit_for_review')}>
                            Submit
                          </Button>
                        ) : null}
                        {listing.status !== 'archived' ? (
                          <Button size="sm" variant="outline" onClick={() => runListingAction(listing._id, 'archive')}>
                            Archive
                          </Button>
                        ) : null}
                        {session?.user?.role === 'admin' && listing.status === 'pending_review' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const reason = window.prompt('Rejection reason')
                              if (reason) {
                                runListingAction(listing._id, 'reject', reason)
                              }
                            }}
                          >
                            Reject
                          </Button>
                        ) : null}
                        {session?.user?.role === 'admin' && listing.status === 'pending_review' ? (
                          <Button size="sm" variant="outline" onClick={() => runListingAction(listing._id, 'publish')}>
                            Publish
                          </Button>
                        ) : null}
                        {session?.user?.role === 'admin' && listing.status === 'published' && !listing.featured ? (
                          <Button size="sm" variant="outline" onClick={() => runListingAction(listing._id, 'feature')}>
                            Feature
                          </Button>
                        ) : null}
                        {session?.user?.role === 'admin' && listing.featured ? (
                          <Button size="sm" variant="outline" onClick={() => runListingAction(listing._id, 'unfeature')}>
                            Unfeature
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr><td className="px-4 py-6" colSpan={6}>No listings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {listings.length} of {pagination.total} listings
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPagination((current) => ({ ...current, page: Math.max(current.page - 1, 1) }))}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPagination((current) => ({ ...current, page: Math.min(current.page + 1, current.totalPages) }))}
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}