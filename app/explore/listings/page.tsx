import Link from 'next/link'
import { ArrowRight, Filter, Globe, MapPin, Search, Sparkles, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getPublicListings, formatLocation } from '@/lib/public-listings'

type ListingIndexProps = {
  searchParams?: {
    q?: string
    category?: string
    location?: string
    featured?: string
  }
}

export const dynamic = 'force-dynamic'

export default async function ExploreListingsPage({ searchParams }: ListingIndexProps) {
  const query = searchParams ?? {}
  const { items, facets } = await getPublicListings({
    search: query.q,
    category: query.category,
    location: query.location,
    featured: query.featured,
  })

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-4">
              Public Catalog
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Browse public listings</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover featured businesses, services, and local listings with a clean, SEO-friendly directory view.
            </p>
          </div>

          <form className="mx-auto mt-8 grid max-w-4xl gap-3 rounded-2xl border bg-card p-4 shadow-sm md:grid-cols-[1.5fr_1fr_1fr_auto]" action="/explore/listings" method="get">
            <div className="relative md:col-span-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input name="q" defaultValue={query.q ?? ''} placeholder="Search by name, city, or category" className="pl-9" />
            </div>
            <Input name="category" defaultValue={query.category ?? ''} placeholder="Category slug, e.g. creative" />
            <Input name="location" defaultValue={query.location ?? ''} placeholder="Location, e.g. Austin" />
            <Button type="submit">
              Filter <Filter className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Popular categories:</span>
            {facets.categories.slice(0, 5).map((category) => (
              <Link key={category} href={`/explore/categories/${category}`}>
                <Badge variant="secondary" className="capitalize">
                  {category.replace(/-/g, ' ')}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Listings</h2>
            <p className="text-sm text-muted-foreground">{items.length} listings match your current filters.</p>
          </div>
          <Link href="/dummy-content">
            <Button variant="outline">View CMS Demo</Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.slug} className="h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {formatLocation(item)}
                    </CardDescription>
                  </div>
                  {item.featured ? <Badge className="shrink-0">Featured</Badge> : <Badge variant="outline">Listing</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex h-full flex-col justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {item.category.replace(/-/g, ' ')}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {item.visibility}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Link href={`/explore/listings/${item.slug}`}>
                    <Button>
                      View Listing <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  {item.website ? (
                    <a href={item.website} target="_blank" rel="noreferrer">
                      <Button variant="outline">Website</Button>
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Need a public profile?</h2>
              <p className="mt-1 text-primary-foreground/80">
                Register and add your own listing through the CMS workflow.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/register">
                <Button variant="secondary">Create Account</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
