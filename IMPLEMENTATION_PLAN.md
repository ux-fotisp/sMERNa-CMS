# sMERNa-CMS Implementation Plan

## Scope

Build sMERNa-CMS into a content management system for listing websites. The current repository already has the core Next.js app structure, auth, MongoDB models, and basic CRUD routes, so the implementation should harden the existing code first and then evolve it into a listing-focused product.

## Project Surface

- `app/` contains the routes for auth, dashboard, content, taxonomy, and public pages.
- `app/api/` contains the content, auth, and taxonomy route handlers that need security and validation work.
- `models/` contains the data layer for users, content, categories, tags, and content types.
- `lib/` contains auth, database, and utility helpers.
- `components/` contains the UI building blocks used by the app shell and admin screens.

## Phase 1: Lock Down The API

Goal: make the current backend safe and predictable.

1. Add Zod schemas for every create and update route.
2. Require authentication on all mutating routes.
3. Add role checks for admin-only operations.
4. Add ownership checks for content edits and deletes.
5. Standardize API error responses and status codes.
6. Normalize database connection handling across route handlers.
7. Add `.env.example` and document all required environment variables.

## Phase 2: Introduce A Listing Model

Goal: represent listing website content explicitly instead of treating everything as generic CMS content.

1. Add a dedicated Listing model.
2. Add fields for title, slug, description, excerpt, status, and visibility.
3. Add location fields such as address, city, region, country, postal code, and coordinates.
4. Add contact fields such as email, phone, website, and inquiry links.
5. Add SEO fields such as meta title, meta description, canonical URL, and social image.
6. Add media fields for logo, gallery, cover image, and attachments.
7. Add ownership and audit fields such as submitted by, approved by, published at, and updated at.

## Phase 3: Build Editorial Workflow

Goal: support the lifecycle of listing records.

1. Add draft, pending review, published, archived, and rejected states.
2. Add submit-for-review, approve, reject, publish, feature, and unfeature actions.
3. Add soft delete or archive behavior instead of hard delete.
4. Add revision history for listing changes.
5. Add preview mode for unpublished listings.

## Phase 4: Improve Management UX

Goal: make the dashboard practical for real catalog operations.

1. Add paginated listing tables.
2. Add search, filters, and sorting controls.
3. Add bulk actions for publish, archive, delete, and feature.
4. Add taxonomy management improvements for categories, tags, and listing types.
5. Add hierarchical category handling where needed.
6. Add import and export for CSV or JSON.

## Phase 5: Public Listing Experience

Goal: expose the catalog cleanly to end users.

1. Add public listing pages with clean slugs.
2. Add listing index pages with filters and facets.
3. Add category and location landing pages.
4. Add structured data for SEO.
5. Add related listings, featured listings, and popular listings.
6. Add clear contact and call-to-action sections.

## Phase 6: Media, Search, And Scale

Goal: prepare for higher content volume and richer assets.

1. Add image upload and media optimization.
2. Add full-text search or external search indexing.
3. Add rate limiting on auth and write-heavy endpoints.
4. Add caching for public listing pages where it helps.
5. Add logging and monitoring.
6. Add backup, restore, and deployment runbooks.

## Phase 7: Quality And Delivery

Goal: keep the project maintainable.

1. Add tests for models, route handlers, and permissions.
2. Add CI for linting, type checking, and tests.
3. Add seed data for development and demos.
4. Add API documentation.
5. Add migration and release checklists.

## Recommended Execution Order

1. Secure the current API.
2. Add the Listing model.
3. Wire the dashboard to listing workflows.
4. Build public listing pages.
5. Add media, search, and scale features.
6. Finish with tests and CI.

## Immediate Next Actions

- Review `app/api/content/route.ts` and `app/api/content/[id]/route.ts` for auth and validation gaps.
- Review `app/api/taxonomy/*` for the same issues.
- Design the Listing model before changing the public UI.
- Replace generic content flows with listing-specific forms and tables.