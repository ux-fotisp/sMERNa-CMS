import { connectDB } from '@/lib/db'
import Listing from '@/models/Listing'

export type PublicListing = {
  title: string
  slug: string
  excerpt: string
  description: string
  featured: boolean
  visibility: string
  status: string
  category: string
  city: string
  region: string
  country: string
  website?: string
  inquiryUrl?: string
  metaTitle: string
  metaDescription: string
}

export type PublicListingFilters = {
  search?: string
  category?: string
  location?: string
  featured?: string
}

export type PublicListingCollection = {
  items: PublicListing[]
  facets: {
    categories: string[]
    locations: string[]
  }
}

const fallbackListings: PublicListing[] = [
  {
    title: 'North Peak Studio',
    slug: 'north-peak-studio',
    excerpt: 'Brand strategy and web design for ambitious teams.',
    description: 'A creative agency listing built to showcase services, contact details, and a polished web presence.',
    featured: true,
    visibility: 'public',
    status: 'published',
    category: 'creative',
    city: 'Austin',
    region: 'Texas',
    country: 'United States',
    website: 'https://example.com/north-peak-studio',
    inquiryUrl: 'https://example.com/north-peak-studio/contact',
    metaTitle: 'North Peak Studio | sMERNa CMS',
    metaDescription: 'Creative agency listing with contact, description, and SEO metadata.',
  },
  {
    title: 'Harbor Supply Co.',
    slug: 'harbor-supply-co',
    excerpt: 'Retail storefront profile with curated discovery fields.',
    description: 'A retail listing designed to surface location, website, and featured status in the public catalog.',
    featured: true,
    visibility: 'public',
    status: 'published',
    category: 'retail',
    city: 'Portland',
    region: 'Oregon',
    country: 'United States',
    website: 'https://example.com/harbor-supply',
    inquiryUrl: 'https://example.com/harbor-supply/contact',
    metaTitle: 'Harbor Supply Co. | sMERNa CMS',
    metaDescription: 'Retail listing with a public profile and clear call to action.',
  },
  {
    title: 'Summit Health Hub',
    slug: 'summit-health-hub',
    excerpt: 'Health and wellness services with a review workflow.',
    description: 'A service listing that demonstrates taxonomy, moderation, and public detail presentation.',
    featured: false,
    visibility: 'public',
    status: 'published',
    category: 'health',
    city: 'Remote',
    region: 'Global',
    country: 'Worldwide',
    website: 'https://example.com/summit-health',
    inquiryUrl: 'https://example.com/summit-health/book',
    metaTitle: 'Summit Health Hub | sMERNa CMS',
    metaDescription: 'Health service listing with workflow and contact actions.',
  },
  {
    title: 'Cedar Ridge Homes',
    slug: 'cedar-ridge-homes',
    excerpt: 'Property and housing directory entry for local discovery.',
    description: 'A real estate style listing that demonstrates location-aware public pages and structured data.',
    featured: false,
    visibility: 'public',
    status: 'published',
    category: 'real-estate',
    city: 'Denver',
    region: 'Colorado',
    country: 'United States',
    website: 'https://example.com/cedar-ridge-homes',
    inquiryUrl: 'https://example.com/cedar-ridge-homes/contact',
    metaTitle: 'Cedar Ridge Homes | sMERNa CMS',
    metaDescription: 'Property listing with location landing page support.',
  },
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const normalizeListing = (listing: any): PublicListing | null => {
  if (!listing) return null

  const city = listing.address?.city ?? 'Unknown'
  const region = listing.address?.region ?? 'Unknown'
  const country = listing.address?.country ?? 'Unknown'
  const category = slugify(listing.listingType || 'general')

  return {
    title: listing.title,
    slug: listing.slug,
    excerpt: listing.excerpt || listing.description?.slice(0, 120) || '',
    description: listing.description || '',
    featured: Boolean(listing.featured),
    visibility: listing.visibility || 'public',
    status: listing.status || 'published',
    category,
    city,
    region,
    country,
    website: listing.contact?.website,
    inquiryUrl: listing.contact?.inquiryUrl,
    metaTitle: listing.seo?.metaTitle || listing.title,
    metaDescription: listing.seo?.metaDescription || listing.excerpt || listing.description?.slice(0, 160) || '',
  }
}

const buildFacets = (items: PublicListing[]) => {
  const categories = Array.from(new Set(items.map((item) => item.category))).sort()
  const locations = Array.from(new Set(items.map((item) => `${item.city}, ${item.region}`))).sort()

  return { categories, locations }
}

const matchesQuery = (item: PublicListing, filters: PublicListingFilters) => {
  const search = filters.search?.trim().toLowerCase()
  const category = filters.category?.trim().toLowerCase()
  const location = filters.location?.trim().toLowerCase()
  const featured = filters.featured?.trim()

  if (search) {
    const haystack = `${item.title} ${item.excerpt} ${item.description} ${item.city} ${item.region} ${item.category}`.toLowerCase()
    if (!haystack.includes(search)) return false
  }

  if (category && item.category !== category) return false

  if (location) {
    const itemLocation = `${item.city}, ${item.region}`.toLowerCase()
    if (!itemLocation.includes(location)) return false
  }

  if (featured === 'true' && !item.featured) return false
  if (featured === 'false' && item.featured) return false

  return true
}

const fetchDatabaseListings = async (): Promise<PublicListing[]> => {
  await connectDB()

  const docs = await Listing.find({
    status: 'published',
    visibility: 'public',
  })
    .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
    .lean()

  return docs.map((doc) => normalizeListing(doc)).filter((item): item is PublicListing => Boolean(item))
}

export async function getPublicListings(filters: PublicListingFilters = {}): Promise<PublicListingCollection> {
  let items = fallbackListings

  try {
    const databaseListings = await fetchDatabaseListings()
    if (databaseListings.length) {
      items = databaseListings
    }
  } catch {
    items = fallbackListings
  }

  const filteredItems = items.filter((item) => matchesQuery(item, filters))

  return {
    items: filteredItems,
    facets: buildFacets(items),
  }
}

export async function getPublicListingBySlug(slug: string): Promise<PublicListing | null> {
  try {
    await connectDB()
    const listing = await Listing.findOne({ slug, status: 'published', visibility: 'public' }).lean()
    const normalized = normalizeListing(listing)
    if (normalized) return normalized
  } catch {
    // Fall back to static demo data below.
  }

  return fallbackListings.find((listing) => listing.slug === slug) ?? null
}

export function getRelatedPublicListings(target: PublicListing, limit = 3) {
  return fallbackListings
    .filter((item) => item.slug !== target.slug)
    .filter((item) => item.category === target.category || item.city === target.city || item.featured)
    .slice(0, limit)
}

export function formatLocation(listing: PublicListing) {
  return `${listing.city}, ${listing.region}, ${listing.country}`
}
