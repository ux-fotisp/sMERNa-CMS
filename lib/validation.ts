import { NextResponse } from 'next/server'
import { z } from 'zod'

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid identifier')

const contentBaseSchema = z.object({
  title: z.string().trim().min(1).max(100),
  body: z.string().trim().min(1),
  categories: z.array(objectIdSchema).optional(),
  tags: z.array(objectIdSchema).optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export const contentCreateSchema = contentBaseSchema.extend({
  contentType: objectIdSchema,
})

export const contentUpdateSchema = contentBaseSchema
  .extend({
    contentType: objectIdSchema.optional(),
  })
  .partial()
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: 'At least one field is required',
  })

export const taxonomySchema = z.object({
  name: z.string().trim().min(1).max(50),
  description: z.string().trim().max(200).optional(),
  parent: objectIdSchema.nullish(),
})

export const listingCreateSchema = z.object({
  title: z.string().trim().min(1).max(120),
  slug: z.string().trim().min(1),
  excerpt: z.string().trim().max(300).optional(),
  description: z.string().trim().min(1),
  status: z.enum(['draft', 'pending_review', 'published', 'archived', 'rejected']).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
  listingType: z.string().trim().optional(),
  address: z
    .object({
      line1: z.string().trim().optional(),
      line2: z.string().trim().optional(),
      city: z.string().trim().optional(),
      region: z.string().trim().optional(),
      country: z.string().trim().optional(),
      postalCode: z.string().trim().optional(),
    })
    .optional(),
  coordinates: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
  contact: z
    .object({
      email: z.string().trim().email().optional(),
      phone: z.string().trim().optional(),
      website: z.string().trim().url().optional(),
      inquiryUrl: z.string().trim().url().optional(),
    })
    .optional(),
  seo: z
    .object({
      metaTitle: z.string().trim().optional(),
      metaDescription: z.string().trim().optional(),
      canonicalUrl: z.string().trim().url().optional(),
      socialImage: z.string().trim().url().optional(),
    })
    .optional(),
  media: z
    .object({
      logo: z.string().trim().url().optional(),
      coverImage: z.string().trim().url().optional(),
      gallery: z.array(z.string().trim().url()).optional(),
      attachments: z.array(z.string().trim().url()).optional(),
    })
    .optional(),
  contentType: objectIdSchema.optional(),
  categories: z.array(objectIdSchema).optional(),
  tags: z.array(objectIdSchema).optional(),
})

export const listingUpdateSchema = listingCreateSchema.partial().refine(
  (value) => Object.values(value).some((field) => field !== undefined),
  { message: 'At least one field is required' }
)

export const registrationSchema = z.object({
  name: z.string().trim().min(1).max(50),
  email: z.string().trim().email(),
  password: z.string().min(6).max(72),
})

export async function validateRequestBody<T extends z.ZodTypeAny>(request: Request, schema: T) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }),
    }
  }

  const result = schema.safeParse(body)

  if (!result.success) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      ),
    }
  }

  return {
    ok: true as const,
    data: result.data,
  }
}