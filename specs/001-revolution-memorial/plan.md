# Implementation Plan: Bilingual Iranian Revolution Memorial Website

**Branch**: `001-revolution-memorial` | **Date**: January 23, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-revolution-memorial/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a bilingual (Persian/English) memorial and documentation website using Next.js App Router with TypeScript. The site preserves historical memory, documents verified events and human loss, presents official statements and news, and organizes photos and videos from inside Iran. The implementation uses a modern React stack with server-side rendering, server actions for mutations, and a PostgreSQL database with Drizzle ORM for data persistence. Media storage is handled via Vercel Blob, and authentication uses Neon Auth for secure admin access.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+  
**Primary Dependencies**: Next.js (latest with App Router), React 19+, shadcn/ui, Radix UI Themes, Tailwind CSS, Framer Motion, Neon Auth, Drizzle ORM, Vercel Blob SDK  
**Storage**: Neon (serverless PostgreSQL) with Drizzle ORM, Vercel Blob for images/videos/audio  
**Testing**: Jest, React Testing Library, Playwright (for E2E)  
**Target Platform**: Web (modern browsers), Server-side rendering with Next.js  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: 
- Homepage loads in <3s on standard broadband
- Language switching <1s
- Page navigation <2s
- Filter operations <1-2s for up to 10k items
- Admin changes reflect within 10s
**Constraints**: 
- WCAG 2.1 Level AA accessibility
- RTL/LTR layout support
- No graphic violence in media
- Respectful, documentary tone
- Bilingual content (Persian/English)
**Scale/Scope**: 
- Up to 10,000 victim entries
- Up to 5,000 media items
- Multiple news articles and statements
- Single admin user or small admin team
- Public-facing memorial site

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: The constitution file (`.specify/memory/constitution.md`) appears to be a template and has not been customized for this project. No specific constitutional gates are defined. Proceeding with standard best practices for web application development.

**Post-Phase 1 Re-check**: ✅ Completed. Data model and contracts have been defined. Architecture follows Next.js App Router best practices with clear separation of concerns. No violations identified. Standard web application structure with appropriate use of libraries (shadcn/ui, Drizzle ORM) rather than custom implementations where possible.

## Project Structure

### Documentation (this feature)

```text
specs/001-revolution-memorial/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
app/
├── (public)/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Public layout with header/footer
│   ├── news/
│   │   ├── page.tsx                # News archive
│   │   └── [slug]/
│   │       └── page.tsx            # News detail
│   ├── statements/
│   │   ├── page.tsx                # Statements listing
│   │   └── [slug]/
│   │       └── page.tsx            # Statement detail
│   ├── victims/
│   │   └── page.tsx                # Victims memorial page
│   └── media/
│       └── page.tsx                # Media gallery
├── (admin)/
│   ├── admin/
│   │   ├── layout.tsx              # Admin layout (protected)
│   │   ├── page.tsx                # Admin dashboard
│   │   ├── victims/
│   │   │   ├── page.tsx            # Victim management
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Edit victim
│   │   ├── news/
│   │   │   ├── page.tsx            # News management
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Edit news
│   │   ├── statements/
│   │   │   ├── page.tsx            # Statements management
│   │   │   └── [slug]/
│   │   │       └── page.tsx        # Edit statement
│   │   └── media/
│   │       ├── page.tsx            # Media management
│   │       └── [id]/
│   │           └── page.tsx        # Edit media
│   └── api/
│       └── auth/
│           └── [...neon]/route.ts  # Neon Auth API routes
├── api/
│   └── [various API routes if needed]
├── components/
│   ├── ui/                         # shadcn/ui components
│   ├── layout/
│   │   ├── Header.tsx              # Header with date, language switcher
│   │   ├── Footer.tsx              # Minimal footer
│   │   └── LanguageSwitcher.tsx    # Persistent language switcher
│   ├── homepage/
│   │   ├── RevolutionSection.tsx   # Section 1
│   │   ├── DictatorshipSection.tsx # Section 2
│   │   ├── VictimStatsSection.tsx # Section 3
│   │   └── NewsSection.tsx        # Section 4
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   ├── NewsDetail.tsx
│   │   └── NewsExcerpt.tsx
│   ├── victims/
│   │   ├── VictimCard.tsx
│   │   ├── VictimFilters.tsx
│   │   └── VictimList.tsx
│   ├── media/
│   │   ├── MediaGrid.tsx
│   │   ├── MediaFilters.tsx
│   │   └── MediaModal.tsx
│   └── statements/
│       ├── StatementCard.tsx
│       └── StatementDetail.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema definitions
│   │   ├── index.ts                # DB connection
│   │   └── migrations/              # Drizzle migrations
│   ├── blob/
│   │   └── index.ts                # Vercel Blob utilities
│   ├── i18n/
│   │   ├── config.ts               # i18n configuration
│   │   ├── server.ts               # Server-side i18n
│   │   └── client.ts               # Client-side i18n
│   ├── actions/
│   │   ├── victims.ts              # Server actions for victims
│   │   ├── news.ts                 # Server actions for news
│   │   ├── statements.ts           # Server actions for statements
│   │   └── media.ts                # Server actions for media
│   └── utils/
│       ├── date.ts                 # Date formatting utilities
│       └── validation.ts           # Validation helpers
├── public/
│   └── assets/
│       └── flag.svg                # Imperial Iranian flag asset
└── styles/
    └── globals.css                 # Tailwind + custom styles

tests/
├── unit/                           # Unit tests
├── integration/                    # Integration tests
└── e2e/                            # Playwright E2E tests
```

**Structure Decision**: Next.js App Router structure with route groups for public and admin sections. Components organized by feature domain. Server actions in `lib/actions/` for mutations. Database schema and utilities in `lib/db/`. Custom i18n system in `lib/i18n/`. This structure supports the bilingual requirement, admin separation, and clear organization of content types.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. Standard Next.js App Router structure with clear separation of concerns.
