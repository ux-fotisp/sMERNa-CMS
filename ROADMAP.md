# sMERNa-CMS Roadmap

## Goal

Turn the current scaffold into a secure, scalable content management system for listing websites, where each listing can represent a business, service, property, place, or similar directory-style record.

## Critical Issues To Fix First

These are the current blockers and high-risk defects:

- Public write access exists on content and taxonomy routes, so anyone who can reach the API can create or modify records.
- Content update and delete endpoints only check whether a session exists, not whether the user owns the content or has admin rights.
- The API accepts raw request bodies without schema validation, which makes malformed or malicious payloads easy to store.
- Database connection handling is inconsistent: some routes disconnect after every request, others never disconnect, which hurts reliability and performance.
- There is no pagination, filtering, or search on listing data, which will fail quickly once the CMS holds real inventory.
- The current implementation does not define a listing-specific model, so it cannot yet represent the fields a listing website needs.

## Current State

The repository already gives us a usable base:

- Next.js with TypeScript and Tailwind CSS
- MongoDB via Mongoose
- NextAuth credentials-based auth
- User, content, content type, category, and tag models
- Basic CRUD API routes for content and taxonomy
- A minimal admin/editor page structure

That base is enough to evolve into a listing platform, but it is not production-ready yet.

## Implementation Plan

### Phase 1: Secure the Core

Goal: make the API safe before adding more features.

- Add Zod schemas for every create and update route.
- Require authentication on all mutating routes.
- Add role checks for admin-only actions.
- Add ownership checks so editors can only update their own listings unless they are admins.
- Return structured API errors with consistent HTTP status codes.
- Standardize database connection handling so routes either reuse the cached connection or cleanly manage lifecycle, but not both.
- Add `.env.example` and document every required secret and service variable.

### Phase 2: Define The Listing Data Model

Goal: represent the real domain of a listing website.

- Introduce a dedicated Listing model.
- Add fields for title, slug, description, excerpt, status, and visibility.
- Add location data such as address, city, region, country, postal code, and coordinates.
- Add classification fields such as listing type, categories, tags, and service areas.
- Add SEO fields such as meta title, meta description, canonical URL, and social image.
- Add contact fields such as email, phone, website, and booking or inquiry links.
- Add media fields for logo, gallery, cover image, and attachments.
- Add ownership and audit fields like submitted by, approved by, published at, and updated at.

### Phase 3: Build The Editorial Workflow

Goal: support submission, review, publishing, and moderation.

- Add draft, pending review, published, archived, and rejected states.
- Add admin moderation actions for approve, reject, feature, and unfeature.
- Add submit-for-review and publish flows.
- Add soft delete or archive rather than hard deletion for listings.
- Add revision history for listing edits.
- Add preview mode for unpublished listings.

### Phase 4: Improve Discovery And Management

Goal: make the CMS practical for day-to-day operations.

- Add paginated listing tables in the dashboard.
- Add search, filters, and sort controls for listings.
- Add taxonomy management for categories, tags, and listing types.
- Add hierarchical category support where the use case needs parent-child navigation.
- Add bulk actions for publish, archive, delete, and feature.
- Add import and export for CSV or JSON.

### Phase 5: Public Listing Experience

Goal: make the managed content useful to end users.

- Add public listing pages with clean slugs.
- Add listing index pages with filters and facets.
- Add location-aware search and category landing pages.
- Add structured data for SEO.
- Add related listings, featured listings, and popular listings.
- Add contact and call-to-action sections for each listing.

### Phase 6: Media, Search, And Scale

Goal: prepare for larger catalogs and richer content.

- Add image upload and media optimization.
- Add full-text search or external search indexing.
- Add rate limiting on auth and write-heavy routes.
- Add caching where it improves public listing pages.
- Add logging and monitoring.
- Add backups, restore guidance, and deployment runbooks.

### Phase 7: Quality And Delivery

Goal: keep the system maintainable.

- Add tests for models, route handlers, and permission logic.
- Add CI for linting, type checking, and tests.
- Add seed data for development and demos.
- Add API documentation for internal and public consumers.
- Add release checklists for schema changes and migrations.

## Priority Order

1. Security and authorization
2. Listing data model
3. Editorial workflow
4. Search, filtering, and public listing pages
5. Media, scale, and operational hardening
6. Tests, CI, and documentation

## Recommended Next Step

Start with Phase 1 and Phase 2 together:

- lock down the current API routes,
- add the listing model,
- then migrate the existing content screens to the new listing workflow.

That sequence prevents us from building on unsafe assumptions and gives us a real base for the listing-site product.
