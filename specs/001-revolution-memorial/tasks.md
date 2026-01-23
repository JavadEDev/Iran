# Tasks: Bilingual Iranian Revolution Memorial Website

**Input**: Design documents from `/specs/001-revolution-memorial/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., [US1], [US2], [US6])
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Next.js project structure with App Router in root directory
- [x] T002 Initialize TypeScript configuration in tsconfig.json
- [x] T003 [P] Configure Tailwind CSS in tailwind.config.ts and styles/globals.css
- [x] T004 [P] Initialize shadcn/ui configuration in components.json
- [x] T005 [P] Install and configure Radix UI Themes
- [x] T006 [P] Install Framer Motion for animations
- [x] T007 [P] Install Drizzle ORM and Neon PostgreSQL client
- [x] T008 [P] Install Vercel Blob SDK
- [x] T009 [P] Install Neon Auth package
- [x] T010 [P] Configure environment variables template in .env.example
- [x] T011 [P] Setup ESLint and Prettier configuration files
- [x] T012 Create public/assets directory and add flag.svg placeholder

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Setup Neon PostgreSQL database connection in lib/db/index.ts
- [x] T014 [P] Create Drizzle schema file with base structure in lib/db/schema.ts
- [x] T015 [P] Configure Drizzle migrations directory in lib/db/migrations/
- [x] T016 [P] Setup Vercel Blob client utilities in lib/blob/index.ts
- [x] T017 [P] Create custom i18n configuration in lib/i18n/config.ts
- [x] T018 [P] Implement server-side i18n utilities in lib/i18n/server.ts
- [x] T019 [P] Implement client-side i18n utilities in lib/i18n/client.ts
- [x] T020 [P] Create date formatting utilities in lib/utils/date.ts
- [x] T021 [P] Create validation helpers in lib/utils/validation.ts
- [x] T022 Create base layout structure in app/(public)/layout.tsx
- [x] T023 [P] Implement Header component with date display in components/layout/Header.tsx
- [x] T024 [P] Implement Footer component in components/layout/Footer.tsx
- [x] T025 [P] Implement LanguageSwitcher component in components/layout/LanguageSwitcher.tsx
- [x] T026 Create loading screen component with flag animation in components/LoadingScreen.tsx
- [x] T027 Setup root layout with loading screen in app/layout.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 6 - Switch Between Languages (Priority: P1) 🌐

**Goal**: Implement bilingual support (Persian/English) with RTL/LTR switching and persistent language preference

**Independent Test**: Use language switcher on any page, verify all text changes language, layout adjusts RTL/LTR, selection persists across navigation

### Implementation for User Story 6

- [x] T028 [US6] Implement language context provider in lib/i18n/context.tsx
- [x] T029 [US6] Add language persistence (localStorage) in lib/i18n/client.ts
- [x] T030 [US6] Implement RTL/LTR layout switching in app/(public)/layout.tsx
- [x] T031 [US6] Add dir attribute handling for RTL in components/layout/Header.tsx
- [x] T032 [US6] Integrate LanguageSwitcher into Header in components/layout/Header.tsx
- [x] T033 [US6] Add Tailwind RTL plugin configuration in tailwind.config.ts
- [x] T034 [US6] Test language switching across all pages (create test pages if needed)

**Checkpoint**: Language switching works independently across all pages

---

## Phase 4: User Story 1 - View Homepage Memorial Content (Priority: P1) 🎯 MVP

**Goal**: Display homepage with four sections (Revolution, Dictatorship, Victim Statistics, News) in respectful, documentary format

**Independent Test**: Navigate to homepage, verify all four sections display correctly with bilingual support, current date in header, respectful presentation

### Database Schema for User Story 1

- [x] T035 [P] [US1] Create victims table schema in lib/db/schema.ts
- [x] T036 [P] [US1] Create news table schema in lib/db/schema.ts
- [x] T037 [P] [US1] Create news_cities junction table schema in lib/db/schema.ts
- [ ] T038 [US1] Generate and run Drizzle migration for victims and news tables

### Server Actions for User Story 1

- [x] T039 [P] [US1] Create getVictimStats server action in lib/actions/victims.ts
- [x] T040 [P] [US1] Create getFeaturedNews server action in lib/actions/news.ts
- [x] T041 [P] [US1] Create getRecentNews server action in lib/actions/news.ts
- [x] T042 [US1] Create getHomepageData server action combining all sections in lib/actions/homepage.ts

### Components for User Story 1

- [x] T043 [P] [US1] Create RevolutionSection component in components/homepage/RevolutionSection.tsx
- [x] T044 [P] [US1] Create DictatorshipSection component in components/homepage/DictatorshipSection.tsx
- [x] T045 [P] [US1] Create VictimStatsSection component in components/homepage/VictimStatsSection.tsx
- [x] T046 [P] [US1] Create NewsSection component in components/homepage/NewsSection.tsx
- [x] T047 [US1] Implement homepage page combining all sections in app/(public)/page.tsx
- [x] T048 [US1] Add Framer Motion animations to homepage sections
- [x] T049 [US1] Integrate bilingual content display in all homepage sections

**Checkpoint**: Homepage displays all four sections correctly with bilingual support - MVP ready

---

## Phase 5: User Story 2 - Browse and Read News Articles (Priority: P2)

**Goal**: Enable visitors to browse news listings, view previews with excerpt separator, and read full articles with media

**Independent Test**: Navigate to news listings, click articles, verify preview behavior (excerpt before separator) and full article display with proper media

### Server Actions for User Story 2

- [x] T050 [P] [US2] Create getNewsList server action in lib/actions/news.ts
- [x] T051 [P] [US2] Create getNewsBySlug server action in lib/actions/news.ts
- [x] T052 [US2] Implement excerpt separator logic in lib/actions/news.ts

### Components for User Story 2

- [x] T053 [P] [US2] Create NewsCard component in components/news/NewsCard.tsx
- [x] T054 [P] [US2] Create NewsExcerpt component in components/news/NewsExcerpt.tsx
- [x] T055 [P] [US2] Create NewsDetail component in components/news/NewsDetail.tsx
- [x] T056 [US2] Implement news archive page in app/(public)/news/page.tsx
- [x] T057 [US2] Implement news detail page in app/(public)/news/[slug]/page.tsx
- [x] T058 [US2] Add media display (image/video/audio) in NewsDetail component
- [x] T059 [US2] Implement long-form readable layout for news detail pages
- [x] T060 [US2] Add bilingual content switching in news pages

**Checkpoint**: News browsing and reading works independently with excerpt separator and media support

---

## Phase 6: User Story 3 - View Victim Memorials (Priority: P2)

**Goal**: Display full list of victims with filtering and sorting capabilities, presented respectfully

**Independent Test**: Navigate to victims page, view entries with all information, use filtering/sorting options

### Database Schema for User Story 3

- [x] T061 [US3] Verify victims table schema exists (created in Phase 4)

### Server Actions for User Story 3

- [x] T062 [P] [US3] Create getVictims server action with filtering in lib/actions/victims.ts
- [x] T063 [P] [US3] Add sorting support to getVictims action in lib/actions/victims.ts
- [x] T064 [US3] Implement pagination for victims list in lib/actions/victims.ts

### Components for User Story 3

- [x] T065 [P] [US3] Create VictimCard component in components/victims/VictimCard.tsx
- [x] T066 [P] [US3] Create VictimFilters component in components/victims/VictimFilters.tsx
- [x] T067 [P] [US3] Create VictimList component in components/victims/VictimList.tsx
- [x] T068 [US3] Implement victims page in app/(public)/victims/page.tsx
- [x] T069 [US3] Add filtering UI with form controls in VictimFilters component
- [x] T070 [US3] Add sorting UI with dropdown in VictimFilters component
- [x] T071 [US3] Implement respectful layout for victim entries (no gamification)
- [x] T072 [US3] Add photo display with proper aspect ratio in VictimCard component
- [x] T073 [US3] Add bilingual content display in victims page

**Checkpoint**: Victims page works independently with filtering, sorting, and respectful presentation

---

## Phase 7: User Story 5 - View Official Statements (Priority: P3)

**Goal**: Display statements page with most recent statement highlighted, and statement detail pages

**Independent Test**: Navigate to statements page, verify most recent statement displayed first with highlighting, click statements to view full content

### Database Schema for User Story 5

- [x] T074 [P] [US5] Create statements table schema in lib/db/schema.ts
- [x] T075 [US5] Generate and run Drizzle migration for statements table

### Server Actions for User Story 5

- [x] T076 [P] [US5] Create getStatementsList server action in lib/actions/statements.ts
- [x] T077 [P] [US5] Create getStatementBySlug server action in lib/actions/statements.ts

### Components for User Story 5

- [x] T078 [P] [US5] Create StatementCard component in components/statements/StatementCard.tsx
- [x] T079 [P] [US5] Create StatementDetail component in components/statements/StatementDetail.tsx
- [x] T080 [US5] Implement statements listing page in app/(public)/statements/page.tsx
- [x] T081 [US5] Implement statement detail page in app/(public)/statements/[slug]/page.tsx
- [x] T082 [US5] Add visual highlighting for most recent statement
- [x] T083 [US5] Add bilingual content display in statements pages

**Checkpoint**: Statements page works independently with latest statement highlighting

---

## Phase 8: User Story 4 - Browse Media Gallery (Priority: P3)

**Goal**: Display media gallery with filtering, sorting, and full-screen modal viewing

**Independent Test**: Navigate to media page, view grid layout, apply filters, sort results, open items in full-screen modal

### Database Schema for User Story 4

- [x] T084 [P] [US4] Create media table schema in lib/db/schema.ts
- [x] T085 [US4] Generate and run Drizzle migration for media table

### Server Actions for User Story 4

- [x] T086 [P] [US4] Create getMediaList server action with filtering in lib/actions/media.ts
- [x] T087 [P] [US4] Add sorting support to getMediaList action in lib/actions/media.ts
- [x] T088 [US4] Implement pagination for media list in lib/actions/media.ts

### Components for User Story 4

- [x] T089 [P] [US4] Create MediaGrid component in components/media/MediaGrid.tsx
- [x] T090 [P] [US4] Create MediaFilters component in components/media/MediaFilters.tsx
- [x] T091 [P] [US4] Create MediaModal component in components/media/MediaModal.tsx
- [x] T092 [US4] Implement media page in app/(public)/media/page.tsx
- [x] T093 [US4] Add responsive grid layout with breakpoints in MediaGrid component
- [x] T094 [US4] Add filtering UI (country, city, type, date range) in MediaFilters component
- [x] T095 [US4] Add sorting UI (date, location) in MediaFilters component
- [x] T096 [US4] Implement full-screen modal with Framer Motion animations in MediaModal component
- [x] T097 [US4] Add smooth, respectful animations for media interactions
- [x] T098 [US4] Add bilingual content display in media page

**Checkpoint**: Media gallery works independently with filtering, sorting, and modal viewing

---

## Phase 9: User Story 7 - Admin Content Management (Priority: P2)

**Goal**: Provide secure admin area for managing all content types (victims, news, statements, media) with bilingual editing

**Independent Test**: Log into admin area, create/edit/delete each content type, upload files, verify changes appear immediately on public pages

### Authentication Setup for User Story 7

- [x] T099 [US7] Configure Neon Auth in app/(admin)/api/auth/[...neon]/route.ts
- [x] T100 [US7] Create admin layout with authentication check in app/(admin)/admin/layout.tsx
- [x] T101 [US7] Implement protected route middleware for admin routes

### Database Schema for User Story 7

- [x] T102 [US7] Verify all tables exist (victims, news, statements, media from previous phases)
- [x] T103 [US7] Create admin_users table schema if needed in lib/db/schema.ts

### Server Actions for User Story 7

- [x] T104 [P] [US7] Create createVictim server action in lib/actions/victims.ts
- [x] T105 [P] [US7] Create updateVictim server action in lib/actions/victims.ts
- [x] T106 [P] [US7] Create deleteVictim server action in lib/actions/victims.ts
- [x] T107 [P] [US7] Create createNews server action in lib/actions/news.ts
- [x] T108 [P] [US7] Create updateNews server action in lib/actions/news.ts
- [x] T109 [P] [US7] Create deleteNews server action in lib/actions/news.ts
- [x] T110 [P] [US7] Create createStatement server action in lib/actions/statements.ts
- [x] T111 [P] [US7] Create updateStatement server action in lib/actions/statements.ts
- [x] T112 [P] [US7] Create deleteStatement server action in lib/actions/statements.ts
- [x] T113 [P] [US7] Create createMedia server action in lib/actions/media.ts
- [x] T114 [P] [US7] Create updateMedia server action in lib/actions/media.ts
- [x] T115 [P] [US7] Create deleteMedia server action in lib/actions/media.ts
- [x] T116 [US7] Implement file upload handling for photos in lib/actions/victims.ts
- [x] T117 [US7] Implement file upload handling for media in lib/actions/news.ts and lib/actions/media.ts
- [x] T118 [US7] Implement file deletion from Vercel Blob in all delete actions
- [x] T119 [US7] Add immediate cache revalidation after admin changes

### Admin Components for User Story 7

- [x] T120 [US7] Create admin dashboard page in app/(admin)/admin/page.tsx
- [x] T121 [P] [US7] Create victim management page in app/(admin)/admin/victims/page.tsx
- [x] T122 [P] [US7] Create victim edit page in app/(admin)/admin/victims/[id]/page.tsx
- [x] T123 [P] [US7] Create news management page in app/(admin)/admin/news/page.tsx
- [x] T124 [P] [US7] Create news edit page in app/(admin)/admin/news/[slug]/page.tsx
- [x] T125 [P] [US7] Create statements management page in app/(admin)/admin/statements/page.tsx
- [x] T126 [P] [US7] Create statement edit page in app/(admin)/admin/statements/[slug]/page.tsx
- [x] T127 [P] [US7] Create media management page in app/(admin)/admin/media/page.tsx
- [x] T128 [P] [US7] Create media edit page in app/(admin)/admin/media/[id]/page.tsx
- [x] T129 [US7] Implement bilingual content editing forms (separate FA/EN fields)
- [x] T130 [US7] Add file upload UI for photos and media in admin forms
- [x] T131 [US7] Add file replacement and deletion UI in admin forms
- [x] T132 [US7] Implement excerpt separator UI for news items
- [x] T133 [US7] Add country and city metadata assignment in admin forms
- [x] T134 [US7] Add validation and error handling in admin forms
- [x] T135 [US7] Implement optimistic UI updates for admin actions

**Checkpoint**: Admin panel works independently for all content types with immediate updates on public pages

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Accessibility & Performance

- [x] T136 [P] Add ARIA labels and roles to all interactive elements
- [x] T137 [P] Implement keyboard navigation for all pages
- [x] T138 [P] Add alt text for all images
- [x] T139 [P] Optimize Framer Motion animations for performance
- [x] T140 [P] Implement lazy loading for images and media
- [x] T141 [P] Add loading states for all asynchronous operations
- [ ] T142 [P] Optimize database queries with proper indexes
- [ ] T143 [P] Implement ISR (Incremental Static Regeneration) for public pages

### Edge Cases & Error Handling

- [x] T144 [P] Handle news items without excerpt separator (fallback to first paragraph)
- [x] T145 [P] Handle zero victim statistics (display "0" or "Data being updated")
- [x] T146 [P] Handle media items without location data
- [ ] T147 [P] Add file upload size limit validation and error messages
- [x] T148 [P] Handle content existing in only one language (show indicator)
- [x] T149 [P] Handle date/timezone conflicts consistently
- [x] T150 [P] Handle rapid language switching (prevent flickering)
- [ ] T151 [P] Handle admin session expiration during editing

### Validation & Testing

- [ ] T152 [P] Test bilingual functionality across all pages
- [ ] T153 [P] Test admin workflow for all content types
- [ ] T154 [P] Test media and image upload/display
- [ ] T155 [P] Verify live data updates (victim statistics)
- [ ] T156 [P] Test RTL/LTR layout switching
- [ ] T157 [P] Test filtering and sorting on all list pages
- [ ] T158 [P] Test responsive design on mobile devices

### Code Quality

- [ ] T159 [P] Code cleanup and refactoring
- [ ] T160 [P] Add TypeScript type safety improvements
- [ ] T161 [P] Update documentation in README.md
- [ ] T162 [P] Run quickstart.md validation
- [ ] T163 [P] Performance audit and optimization
- [ ] T164 [P] Security audit for admin routes

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 6 (Phase 3)**: Depends on Foundational - Can run in parallel with other stories but should complete early
- **User Story 1 (Phase 4)**: Depends on Foundational + US6 (language system) - MVP target
- **User Stories 2, 3, 5, 7 (Phases 5-9)**: All depend on Foundational + US6 - Can run in parallel after US1
- **User Story 4 (Phase 8)**: Depends on Foundational + US6 - Can run in parallel
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 6 (P1)**: Can start after Foundational - No dependencies on other stories (but enables all others)
- **User Story 1 (P1)**: Depends on Foundational + US6 (language system) - No other story dependencies
- **User Story 2 (P2)**: Depends on Foundational + US6 - Uses news schema from US1
- **User Story 3 (P2)**: Depends on Foundational + US6 - Uses victims schema from US1
- **User Story 7 (P2)**: Depends on Foundational + US6 - Manages all content types (needs schemas from US1, US2, US3, US5, US4)
- **User Story 5 (P3)**: Depends on Foundational + US6 - Independent
- **User Story 4 (P3)**: Depends on Foundational + US6 - Independent

### Within Each User Story

- Database schema before server actions
- Server actions before components
- Components before pages
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational + US6 complete, user stories can start in parallel (if team capacity allows)
- Models/schemas within a story marked [P] can run in parallel
- Server actions within a story marked [P] can run in parallel
- Components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all schema tasks together:
Task: "Create victims table schema in lib/db/schema.ts"
Task: "Create news table schema in lib/db/schema.ts"
Task: "Create news_cities junction table schema in lib/db/schema.ts"

# Launch all server actions together:
Task: "Create getVictimStats server action in lib/actions/victims.ts"
Task: "Create getFeaturedNews server action in lib/actions/news.ts"
Task: "Create getRecentNews server action in lib/actions/news.ts"

# Launch all components together:
Task: "Create RevolutionSection component in components/homepage/RevolutionSection.tsx"
Task: "Create DictatorshipSection component in components/homepage/DictatorshipSection.tsx"
Task: "Create VictimStatsSection component in components/homepage/VictimStatsSection.tsx"
Task: "Create NewsSection component in components/homepage/NewsSection.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 6 + 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 6 (Language Switching)
4. Complete Phase 4: User Story 1 (Homepage)
5. **STOP and VALIDATE**: Test homepage independently with bilingual support
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 6 (Language) → Test independently
3. Add User Story 1 (Homepage) → Test independently → Deploy/Demo (MVP!)
4. Add User Story 2 (News) → Test independently → Deploy/Demo
5. Add User Story 3 (Victims) → Test independently → Deploy/Demo
6. Add User Story 7 (Admin) → Test independently → Deploy/Demo
7. Add User Story 5 (Statements) → Test independently → Deploy/Demo
8. Add User Story 4 (Media) → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 6 (Language) - CRITICAL PATH
   - Developer B: Prepares schemas for User Story 1
3. Once User Story 6 is done:
   - Developer A: User Story 1 (Homepage) - MVP
   - Developer B: User Story 2 (News)
   - Developer C: User Story 3 (Victims)
4. Once schemas are ready:
   - Developer A: User Story 7 (Admin)
   - Developer B: User Story 5 (Statements)
   - Developer C: User Story 4 (Media)
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- User Story 6 (Language) should complete early as it enables all other stories
- User Story 1 (Homepage) is the MVP target
- User Story 7 (Admin) requires all content schemas to be complete first
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
