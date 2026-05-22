# sMERNa CMS

sMERNa CMS is a Next.js-based content management system focused on listing websites. It provides authenticated dashboards, listing workflows, taxonomy management, and MongoDB-backed persistence for structured catalog content.

## Overview

The application is built to manage listings from draft through review, publication, feature management, and archive. It uses server-rendered pages for the admin experience and API routes for secure CRUD and workflow operations.

## Tech Stack

- **Framework:** Next.js 13 with the App Router
- **UI:** React 18, Tailwind CSS, shadcn/ui, Radix UI
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js with credentials-based sessions
- **Validation:** Zod
- **Forms:** react-hook-form with Zod resolver

## Core Features

- User registration and login
- Role-based dashboard access
- Listing creation, viewing, workflow actions, and archiving
- Taxonomy management for categories, tags, and content types
- Secure API routes with request validation and ownership checks
- Listing metadata for location, contact, SEO, and media

## Main Areas

- `app/` contains the public pages, dashboard, and API routes.
- `models/` contains the Mongoose models for users, content, taxonomy, and listings.
- `lib/` contains database, access, and validation helpers.
- `components/` contains reusable UI building blocks.

## Environment Variables

Create a `.env.local` file with:

- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

See [`.env.example`](.env.example) for the expected format.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` after the server starts.

## Notes

- This repository no longer depends on StackBlitz or Bolt links in the README.
- The project roadmap and implementation details are documented in [ROADMAP.md](ROADMAP.md) and [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).