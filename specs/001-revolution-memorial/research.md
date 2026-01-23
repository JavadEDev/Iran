# Research & Technology Decisions

**Feature**: Bilingual Iranian Revolution Memorial Website  
**Date**: January 23, 2026  
**Phase**: 0 - Research & Technology Selection

## Technology Stack Decisions

### Framework: Next.js with App Router

**Decision**: Use Next.js (latest version) with App Router and TypeScript

**Rationale**:
- Server-side rendering for SEO and performance (critical for memorial/documentation site)
- App Router provides modern React patterns with Server Components and Server Actions
- Built-in routing, image optimization, and performance optimizations
- TypeScript support for type safety across the application
- Excellent developer experience and ecosystem

**Alternatives Considered**:
- **Remix**: Similar SSR capabilities but smaller ecosystem
- **SvelteKit**: Different paradigm, team familiarity with React
- **Plain React + Vite**: Would require additional setup for SSR, routing, and optimizations

### UI Component Library: shadcn/ui + Radix UI Themes

**Decision**: Use shadcn/ui as primary component library with Radix UI Themes

**Rationale**:
- shadcn/ui provides accessible, customizable components built on Radix UI primitives
- Radix UI Themes provides layout, typography, and accessibility foundations
- Avoids custom components when library components exist (reduces maintenance)
- Full control over component code (components are copied into project, not installed)
- Excellent accessibility support (critical for memorial site)
- Dark, serious theme support aligns with project requirements

**Alternatives Considered**:
- **Material-UI**: More opinionated, heavier bundle size
- **Chakra UI**: Good but shadcn/ui offers more flexibility
- **Custom components**: Would require significant development time and accessibility testing

### Styling: Tailwind CSS

**Decision**: Use Tailwind CSS for styling

**Rationale**:
- Utility-first approach enables rapid development
- Excellent RTL support (critical for Persian language)
- Dark theme support built-in
- Small bundle size with purging
- Consistent design system
- Works seamlessly with shadcn/ui

**Alternatives Considered**:
- **CSS Modules**: More verbose, less utility-focused
- **Styled Components**: Runtime overhead, less optimal for SSR
- **Sass/SCSS**: Traditional but less modern approach

### Animation: Framer Motion

**Decision**: Use Framer Motion for animations

**Rationale**:
- Smooth, performant animations for page transitions, section reveals, modals, and layout animations
- Excellent React integration
- Supports complex animation sequences
- Good performance with GPU acceleration
- Works well with Next.js App Router

**Alternatives Considered**:
- **CSS Animations**: Less flexible, harder to coordinate complex sequences
- **React Spring**: Good but Framer Motion has better documentation and community
- **GSAP**: Overkill for this project, larger bundle size

### Authentication: Neon Auth

**Decision**: Use Neon Auth for admin authentication

**Rationale**:
- Secure authentication solution
- Integrates well with Next.js
- Provides protected route capabilities
- Admin-only access requirements met
- Modern, maintained solution

**Alternatives Considered**:
- **NextAuth.js**: More complex setup, Neon Auth is simpler for this use case
- **Clerk**: More features than needed, potential over-engineering
- **Custom auth**: Security risks, significant development time

### Database: Neon (serverless PostgreSQL) + Drizzle ORM

**Decision**: Use Neon PostgreSQL with Drizzle ORM

**Rationale**:
- Serverless PostgreSQL scales automatically
- Drizzle ORM provides type-safe database access with TypeScript
- Excellent performance for read-heavy workloads (memorial site)
- Supports complex queries needed for filtering and sorting
- Migration support for schema evolution
- Good developer experience

**Alternatives Considered**:
- **Prisma**: More opinionated, Drizzle is more flexible
- **TypeORM**: Less modern, larger bundle
- **Supabase**: More features than needed, Neon is more focused
- **MongoDB**: Document store less suitable for relational data (victims, news, media relationships)

### Media Storage: Vercel Blob

**Decision**: Use Vercel Blob for images, videos, and audio storage

**Rationale**:
- Optimized for Next.js applications
- Automatic image optimization (WebP conversion)
- CDN delivery for fast global access
- Safe replace and delete operations
- Metadata stored in database (blob URLs referenced)
- Simple API for upload/delete operations

**Alternatives Considered**:
- **AWS S3**: More complex setup, requires additional configuration
- **Cloudinary**: More features than needed, additional cost
- **Local storage**: Not scalable, deployment complexity
- **Supabase Storage**: Good alternative but Vercel Blob integrates better with Next.js

### Internationalization: Custom FA/EN System

**Decision**: Build custom bilingual system (Persian/English) with RTL/LTR support

**Rationale**:
- Only two languages needed (Persian and English)
- Full control over translation system
- RTL/LTR switching requirements
- Language preference stored client-side (localStorage/cookies)
- Simpler than full i18n library for two-language use case
- Can use React Context or similar for language state management

**Alternatives Considered**:
- **next-intl**: Good but may be overkill for two languages
- **react-i18next**: More complex setup
- **next-i18next**: Requires additional configuration

### Data Fetching: Server Actions + Server Components

**Decision**: Use Next.js Server Actions for mutations and Server Components for data fetching

**Rationale**:
- Optimistic UI updates supported
- Type-safe with TypeScript
- No API routes needed for most operations
- Server-side data fetching reduces client bundle
- Automatic revalidation support
- Immediate updates on public pages after admin changes

**Alternatives Considered**:
- **REST API**: More boilerplate, additional endpoints to maintain
- **GraphQL**: Overkill for this use case
- **tRPC**: Good but Server Actions are built into Next.js

## Architecture Patterns

### App Router Structure

**Decision**: Use Next.js App Router with route groups for public and admin sections

**Rationale**:
- Clear separation between public and admin areas
- Layout sharing within route groups
- Type-safe routing with TypeScript
- Server Components by default for better performance

### Server Actions for Mutations

**Decision**: Use Server Actions for all admin mutations (create, update, delete)

**Rationale**:
- No API routes needed
- Type-safe with TypeScript
- Optimistic UI updates
- Automatic form handling
- Built-in error handling

### Client-Side Language Preference

**Decision**: Store language preference in client-side storage (localStorage with cookie fallback)

**Rationale**:
- Persists across sessions
- No server-side session needed for language
- Fast switching without server round-trip
- Works with static generation where possible

## Performance Considerations

### Image Optimization

- Vercel Blob provides automatic WebP conversion
- Next.js Image component for lazy loading and responsive images
- Optimized delivery via CDN

### Caching Strategy

- Static generation for public pages where possible
- ISR (Incremental Static Regeneration) for dynamic content
- Revalidation on admin content changes
- Efficient database queries with Drizzle ORM

### Bundle Size

- Tree-shaking with modern bundlers
- Code splitting by route (automatic with App Router)
- Lazy loading for media components
- Minimal client-side JavaScript for public pages

## Accessibility Requirements

- WCAG 2.1 Level AA compliance
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios
- Focus management

## Security Considerations

- Admin routes protected with Neon Auth
- Server Actions validate all inputs
- File upload validation (type, size)
- SQL injection prevention via Drizzle ORM (parameterized queries)
- XSS prevention via React's built-in escaping
- CSRF protection via Next.js built-in mechanisms

## Deployment Considerations

- Vercel deployment (optimal for Next.js)
- Environment variables for database and blob storage
- Database migrations via Drizzle
- CI/CD for automated deployments

## Open Questions Resolved

All technical decisions have been made based on user requirements. No open questions remain for Phase 0.
