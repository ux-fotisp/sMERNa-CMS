import Link from 'next/link'
import { ArrowRight, BadgeCheck, Briefcase, FileText, LayoutGrid, MapPin, Search, ShieldCheck, Sparkles, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const sampleListings = [
  {
    title: 'North Peak Studio',
    type: 'Creative Agency',
    location: 'Austin, TX',
    status: 'Published',
    description: 'Brand strategy, web design, and launch support for growing teams.',
  },
  {
    title: 'Harbor Supply Co.',
    type: 'Retail Listing',
    location: 'Portland, OR',
    status: 'Featured',
    description: 'A curated storefront profile with contact, socials, and SEO metadata.',
  },
  {
    title: 'Summit Health Hub',
    type: 'Service Directory',
    location: 'Remote',
    status: 'Pending Review',
    description: 'Structured service listing with taxonomy, workflow, and moderation support.',
  },
]

const capabilities = [
  {
    icon: FileText,
    title: 'Listing management',
    description: 'Create structured listings with title, slug, description, contact, location, and SEO fields.',
  },
  {
    icon: LayoutGrid,
    title: 'Admin dashboard',
    description: 'Review listings, filter by status, and manage content in a clean management table.',
  },
  {
    icon: Tag,
    title: 'Taxonomy system',
    description: 'Organize listings with categories, tags, and content types for flexible browsing.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure APIs',
    description: 'Protected routes enforce validation, authentication, ownership, and admin permissions.',
  },
  {
    icon: Search,
    title: 'Search and filters',
    description: 'Search listings, sort results, and filter by status, visibility, and featured state.',
  },
  {
    icon: BadgeCheck,
    title: 'Workflow actions',
    description: 'Submit, approve, reject, publish, feature, archive, and bulk-manage listings.',
  },
]

const stack = [
  'Next.js 13 App Router',
  'React 18',
  'TypeScript',
  'MongoDB + Mongoose',
  'NextAuth.js',
  'Zod validation',
  'Tailwind CSS',
  'shadcn/ui',
]

const workflow = [
  'Draft a listing with structured metadata.',
  'Send it into review for moderation.',
  'Approve and publish it for public discovery.',
  'Feature, archive, or bulk-manage it as the catalog grows.',
]

export default function DummyContentPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="outline" className="mb-4">
              CMS Preview
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              See what sMERNa CMS can manage
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              This page showcases the listing-focused CMS experience: structured content, moderation workflows,
              taxonomy, and publication tools built for directory-style websites.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {capabilities.map((item) => {
            const Icon = item.icon

            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Sample listings</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {sampleListings.map((listing) => (
            <Card key={listing.title}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{listing.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {listing.type} · {listing.location}
                    </CardDescription>
                  </div>
                  <Badge>{listing.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{listing.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">SEO ready</Badge>
                  <Badge variant="secondary">Workflow enabled</Badge>
                  <Badge variant="secondary">Taxonomy linked</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>How content flows</CardTitle>
              <CardDescription>From draft to publication, the CMS supports a simple review lifecycle.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {workflow.map((step, index) => (
                  <li key={step} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="text-sm text-muted-foreground">{step}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technology stack</CardTitle>
              <CardDescription>The app is built with modern web tooling and a MongoDB-backed data model.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stack.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <div>
                  <Briefcase className="mb-2 h-5 w-5 text-primary" />
                  Directory-style business listings
                </div>
                <div>
                  <Tag className="mb-2 h-5 w-5 text-primary" />
                  Categories, tags, and content types
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Ready to explore the CMS?</h2>
              <p className="mt-1 text-primary-foreground/80">
                Register, create listings, and manage them from the dashboard.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}