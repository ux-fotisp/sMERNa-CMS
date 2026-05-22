import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getPublicListings } from '@/lib/public-listings'

const categoryLabels: Record<string, { title: string; description: string }> = {
  creative: { title: 'Creative services', description: 'Branding, design, and agency-style listings.' },
  retail: { title: 'Retail listings', description: 'Stores, shops, and product-focused businesses.' },
  health: { title: 'Health listings', description: 'Wellness, medical, and service-based listings.' },
  'real-estate': { title: 'Real estate listings', description: 'Property, housing, and local place directories.' },
  general: { title: 'General listings', description: 'Mixed directory records ready for discovery.' },
}

type CategoryPageProps = {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: CategoryPageProps) {
  const label = categoryLabels[params.slug]

  if (!label) {
    notFound()
  }

  const { items } = await getPublicListings({ category: params.slug })

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4">Category</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{label.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{label.description}</p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Listings in this category</h2>
            <p className="text-sm text-muted-foreground">{items.length} listings available.</p>
          </div>
          <Link href="/explore/listings">
            <Button variant="outline">
              Back to Catalog <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.slug}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
