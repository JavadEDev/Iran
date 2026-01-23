# Server Actions API Contracts

**Feature**: Bilingual Iranian Revolution Memorial Website  
**Date**: January 23, 2026

## Overview

This document defines the Server Actions used for data mutations. Server Actions are Next.js App Router's way of handling form submissions and mutations without traditional API routes.

## Authentication

All admin actions require authentication via Neon Auth middleware.

## Victim Actions

### `createVictim(input: VictimInput): Promise<ActionResult<Victim>>`

Creates a new victim entry.

**Input**:
```typescript
{
  fullNameFa?: string;
  fullNameEn?: string;
  age?: number;
  gender: Gender;
  city: string;
  dateOfDeath: Date;
  photoFile?: File;
  notesFa?: string;
  notesEn?: string;
}
```

**Returns**: `ActionResult<Victim>`

**Errors**:
- Validation errors (missing required fields)
- File upload errors (size, type)
- Database errors

**Side Effects**:
- Uploads photo to Vercel Blob if provided
- Creates database record
- Invalidates victim statistics cache

---

### `updateVictim(id: string, input: Partial<VictimInput>): Promise<ActionResult<Victim>>`

Updates an existing victim entry.

**Input**: Partial `VictimInput` (all fields optional)

**Returns**: `ActionResult<Victim>`

**Errors**:
- Victim not found
- Validation errors
- File upload errors

**Side Effects**:
- Replaces photo if new file provided
- Deletes old photo from Vercel Blob if replaced
- Updates database record
- Invalidates victim statistics cache

---

### `deleteVictim(id: string): Promise<ActionResult<void>>`

Deletes a victim entry.

**Input**: `id: string`

**Returns**: `ActionResult<void>`

**Errors**:
- Victim not found
- Permission denied

**Side Effects**:
- Deletes photo from Vercel Blob
- Deletes database record
- Invalidates victim statistics cache

---

### `getVictims(filters?: VictimFilters, sort?: VictimSortOptions, page?: number, pageSize?: number): Promise<PaginatedResponse<Victim>>`

Retrieves victims with filtering and sorting.

**Input**:
```typescript
{
  filters?: {
    city?: string;
    gender?: Gender;
    minAge?: number;
    maxAge?: number;
    dateFrom?: Date;
    dateTo?: Date;
  };
  sort?: {
    field: 'dateOfDeath' | 'createdAt' | 'name';
    direction: 'asc' | 'desc';
  };
  page?: number;
  pageSize?: number;
}
```

**Returns**: `PaginatedResponse<Victim>`

---

### `getVictimStats(): Promise<VictimStats>`

Retrieves victim statistics (total and by gender).

**Returns**: 
```typescript
{
  total: number;
  byGender: {
    male: number;
    female: number;
    child: number;
    unknown: number;
  };
}
```

**Caching**: Results are cached and revalidated on victim data changes.

## News Actions

### `createNews(input: NewsInput): Promise<ActionResult<News>>`

Creates a new news item.

**Input**: `NewsInput` (see types.ts)

**Returns**: `ActionResult<News>`

**Side Effects**:
- Uploads media files to Vercel Blob if provided
- Creates database record
- Creates news_cities junction records
- Invalidates news cache

---

### `updateNews(slug: string, input: Partial<NewsInput>): Promise<ActionResult<News>>`

Updates an existing news item.

**Input**: Partial `NewsInput`

**Returns**: `ActionResult<News>`

**Side Effects**:
- Replaces media files if new files provided
- Deletes old media from Vercel Blob if replaced
- Updates news_cities junction records
- Invalidates news cache

---

### `deleteNews(slug: string): Promise<ActionResult<void>>`

Deletes a news item.

**Input**: `slug: string`

**Returns**: `ActionResult<void>`

**Side Effects**:
- Deletes all media files from Vercel Blob
- Deletes news_cities junction records
- Deletes database record
- Invalidates news cache

---

### `getNewsList(page?: number, pageSize?: number): Promise<PaginatedResponse<NewsPreview>>`

Retrieves paginated list of news items.

**Returns**: `PaginatedResponse<NewsPreview>`

---

### `getNewsBySlug(slug: string, lang: Language): Promise<NewsDetail | null>`

Retrieves a single news item by slug with localized content.

**Input**: `slug: string`, `lang: Language`

**Returns**: `NewsDetail | null`

---

### `getFeaturedNews(lang: Language): Promise<NewsPreview | null>`

Retrieves the most recent news item for homepage.

**Returns**: `NewsPreview | null`

## Statement Actions

### `createStatement(input: StatementInput): Promise<ActionResult<Statement>>`

Creates a new official statement.

**Input**: `StatementInput` (see types.ts)

**Returns**: `ActionResult<Statement>`

**Side Effects**:
- Uploads image to Vercel Blob if provided
- Creates database record
- Invalidates statements cache

---

### `updateStatement(slug: string, input: Partial<StatementInput>): Promise<ActionResult<Statement>>`

Updates an existing statement.

**Input**: Partial `StatementInput`

**Returns**: `ActionResult<Statement>`

**Side Effects**:
- Replaces image if new file provided
- Deletes old image from Vercel Blob if replaced
- Invalidates statements cache

---

### `deleteStatement(slug: string): Promise<ActionResult<void>>`

Deletes a statement.

**Input**: `slug: string`

**Returns**: `ActionResult<void>`

**Side Effects**:
- Deletes image from Vercel Blob
- Deletes database record
- Invalidates statements cache

---

### `getStatementsList(): Promise<StatementPreview[]>`

Retrieves all statements ordered by publication date (most recent first).

**Returns**: `StatementPreview[]`

---

### `getStatementBySlug(slug: string, lang: Language): Promise<Statement | null>`

Retrieves a single statement by slug with localized content.

**Input**: `slug: string`, `lang: Language`

**Returns**: `Statement | null`

## Media Actions

### `createMedia(input: MediaInput): Promise<ActionResult<MediaItem>>`

Creates a new media item (photo or video).

**Input**: `MediaInput` (see types.ts)

**Returns**: `ActionResult<MediaItem>`

**Side Effects**:
- Uploads file to Vercel Blob
- Generates thumbnail for videos if applicable
- Creates database record
- Invalidates media cache

---

### `updateMedia(id: string, input: Partial<MediaInput>): Promise<ActionResult<MediaItem>>`

Updates an existing media item.

**Input**: Partial `MediaInput`

**Returns**: `ActionResult<MediaItem>`

**Side Effects**:
- Replaces file if new file provided
- Deletes old file from Vercel Blob if replaced
- Updates database record
- Invalidates media cache

---

### `deleteMedia(id: string): Promise<ActionResult<void>>`

Deletes a media item.

**Input**: `id: string`

**Returns**: `ActionResult<void>`

**Side Effects**:
- Deletes file and thumbnail from Vercel Blob
- Deletes database record
- Invalidates media cache

---

### `getMediaList(filters?: MediaFilters, sort?: MediaSortOptions, page?: number, pageSize?: number): Promise<PaginatedResponse<MediaItem>>`

Retrieves media items with filtering and sorting.

**Input**: Filters, sort options, pagination

**Returns**: `PaginatedResponse<MediaItem>`

## Homepage Actions

### `getHomepageData(lang: Language): Promise<HomepageData>`

Retrieves all data needed for homepage rendering.

**Input**: `lang: Language`

**Returns**: `HomepageData` (see types.ts)

**Caching**: Results are cached with ISR (Incremental Static Regeneration).

## Error Handling

All Server Actions return `ActionResult<T>` which is either:
- `{ success: true, data: T }` on success
- `{ success: false, error: string }` on failure

Client-side code should check `success` before accessing `data`.

## Validation

All inputs are validated server-side before processing:
- Required fields checked
- Type validation
- File size/type validation for uploads
- Slug format validation
- Date range validation

## Authorization

Admin-only actions (create, update, delete) require:
- Valid Neon Auth session
- Admin role/permission

Public actions (read operations) are accessible without authentication.
