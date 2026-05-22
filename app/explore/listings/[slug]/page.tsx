import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Globe, Mail, MapPin, Phone, Sparkles, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatLocation, getPublicListingBySlug, getPublicListings, getRelatedPublicListings } from '@/lib/public-listings'

type ListingPageProps = {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: ListingPageProps) {
  const listing = await getPublicListingBySlug(params.slug)

  if (!listing) {
    return { title: 'Listing not found | sMERNa CMS' }
  }

  return {
    title: listing.metaTitle,
    description: listing.metaDescription,
  }
}

export default async function PublicListingPage({ params }: ListingPageProps) {
  const listing = await getPublicListingBySlug(params.slug)

  if (!listing) {
    notFound()
  }

  const relatedListings = getRelatedPublicListings(listing)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.title,
    description: listing.description,
    url: `/explore/listings/${listing.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.city,
      addressRegion: listing.region,
      addressCountry: listing.country,
    },
    sameAs: listing.website ? [listing.website] : undefined,
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge>{listing.featured ? 'Featured' : 'Listing'}</Badge>
              <Badge variant="secondary" className="capitalize">
                {listing.category.replace(/-/g, ' ')}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {listing.visibility}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{listing.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{listing.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/explore/listings">
                <Button variant="outline">Back to Listings</Button>
              </Link>
              {listing.website ? (
                <a href={listing.website} target="_blank" rel="noreferrer">
                  <Button>
                    Visit Website <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-7 text-muted-foreground">{listing.description}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-primary" /> Location
                    </div>
                    <p className="text-sm text-muted-foreground">{formatLocation(listing)}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium">
                      <Star className="h-4 w-4 text-primary" /> Publication
                    </div>
                    <p className="text-sm text-muted-foreground">Published as a public directory listing.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Structured data</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">{JSON.stringify(structuredData, null, 2)}</pre>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.website ? (
                  <a className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline" href={listing.website} target="_blank" rel="noreferrer">
                    <Globe className="h-4 w-4" /> Visit website
                  </a>
                ) : null}
                {listing.inquiryUrl ? (
                  <a className="flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline" href={listing.inquiryUrl} target="_blank" rel="noreferrer">
                    <Mail className="h-4 w-4" /> Send inquiry
                  </a>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Related listings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedListings.map((related) => (
                  <Link key={related.slug} href={`/explore/listings/${related.slug}`} className="block rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <div className="font-medium">{related.title}</div>
                    <div className="text-sm text-muted-foreground">{formatLocation(related)}</div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold">Want your own profile?</h2>
                <p className="mt-2 text-sm text-primary-foreground/80">
                  Create an account and submit a listing through the CMS workflow.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/register">
                    <Button variant="secondary">Register</Button>
                  </Link>
                  <Link href="/dummy-content">
                    <Button variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                      Demo Content
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    </div>
  )
}
