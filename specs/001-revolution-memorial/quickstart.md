# Quick Start Guide

**Feature**: Bilingual Iranian Revolution Memorial Website  
**Date**: January 23, 2026

## Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- Neon PostgreSQL database account
- Vercel account (for Blob storage and deployment)
- Neon Auth account (for admin authentication)

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd ir-rev

# Install dependencies
npm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# Vercel Blob
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"

# Neon Auth
NEON_AUTH_SECRET="your_neon_auth_secret"
NEON_AUTH_URL="your_neon_auth_url"

# App URL (for production)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### 3. Database Setup

```bash
# Generate Drizzle migration from schema
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database with initial data
npm run db:seed
```

### 4. Initialize shadcn/ui Components

```bash
# Initialize shadcn/ui (if not already done)
npx shadcn-ui@latest init

# Add required components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
# ... add other components as needed
```

### 5. Add Imperial Iranian Flag Asset

Place the flag asset in `public/assets/flag.svg` (or appropriate format).

## Development

### Start Development Server

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

### Project Structure Overview

```
app/
├── (public)/          # Public routes
│   ├── page.tsx       # Homepage
│   ├── news/          # News pages
│   ├── statements/    # Statements pages
│   ├── victims/       # Victims page
│   └── media/         # Media gallery
├── (admin)/           # Admin routes (protected)
│   └── admin/         # Admin dashboard and management
├── api/               # API routes (if needed)
└── components/        # React components

lib/
├── db/                # Database schema and connection
├── blob/              # Vercel Blob utilities
├── i18n/              # Internationalization
├── actions/           # Server Actions
└── utils/             # Utility functions
```

## Key Development Tasks

### Adding a New Component

1. Create component in appropriate `components/` subdirectory
2. Use shadcn/ui components when possible
3. Ensure RTL/LTR support for bilingual content
4. Add TypeScript types from `contracts/types.ts`

### Creating a Server Action

1. Create action in `lib/actions/[entity].ts`
2. Follow patterns from `contracts/server-actions.md`
3. Return `ActionResult<T>` type
4. Handle validation and errors
5. Invalidate relevant caches

### Adding Database Schema Changes

1. Update `lib/db/schema.ts`
2. Generate migration: `npm run db:generate`
3. Review migration file
4. Run migration: `npm run db:migrate`

### Working with Media Uploads

1. Use Vercel Blob SDK in Server Actions
2. Validate file type and size
3. Store blob URL in database
4. Handle cleanup on delete/update

## Testing

### Run Tests

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Coverage

```bash
npm run test:coverage
```

## Building for Production

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Deployment

### Deploy to Vercel

1. Connect repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Database Migrations in Production

Run migrations as part of deployment process or manually:

```bash
npm run db:migrate
```

## Common Tasks

### Adding a New Language

Currently supports Persian (FA) and English (EN). To add more:
1. Update `Language` type in `contracts/types.ts`
2. Add language support in `lib/i18n/`
3. Update database schema if needed
4. Add RTL support if required

### Updating Homepage Content

Homepage sections are managed through:
- Database content (for dynamic sections like news)
- Configuration files (for static sections like revolution intro)
- Admin interface (for content management)

### Admin Access

1. Set up Neon Auth admin user
2. Access admin at `/admin`
3. Authenticate with Neon Auth credentials

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` in `.env.local`
- Check Neon database is running
- Verify network access

### Blob Storage Issues

- Verify `BLOB_READ_WRITE_TOKEN` is set
- Check Vercel Blob storage quota
- Verify file size limits

### Authentication Issues

- Verify Neon Auth configuration
- Check session cookies
- Verify admin user exists

### RTL/LTR Layout Issues

- Check `dir` attribute on HTML elements
- Verify Tailwind RTL classes
- Test language switching

## Next Steps

1. Review [data-model.md](./data-model.md) for database schema
2. Review [contracts/](./contracts/) for API contracts
3. Review [research.md](./research.md) for technology decisions
4. Start implementing features following the plan

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Neon Auth Documentation](https://neon.tech/docs/auth)
