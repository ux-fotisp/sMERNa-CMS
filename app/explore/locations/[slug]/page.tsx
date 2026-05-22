import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPublicListings, formatLocation } from '@/lib/public-listings'

type LocationPageProps = {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export default async function LocationPage({ params }: LocationPageProps) {
  const { items } = await getPublicListings()
  const locationItems = items.filter((item) => slugify(`${item.city}-${item.region}`) === params.slug || slugify(item.city) === params.slug)

  if (!locationItems.length) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4">Location</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{locationItems[0].city}</h1>
            <p className="mt-4 text-lg text-muted-foreground">Explore listings connected to this location and nearby directory entries.</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Listings near {locationItems[0].city}</h2>
            <p className="text-sm text-muted-foreground">{locationItems.length} listings available.</p>
          </div>
          <Link href="/explore/listings">
            <Button variant="outline">
              Back to Catalog <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {locationItems.map((item) => (
            <Card key={item.slug}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {formatLocation(item)}
                </p>
                <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                <Link href={`/explore/listings/${item.slug}`}>
                  <Button variant="outline" className="w-full">
                    View Listing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
