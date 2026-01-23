# Data Model

**Feature**: Bilingual Iranian Revolution Memorial Website  
**Date**: January 23, 2026  
**Phase**: 1 - Design & Contracts

## Database Schema

### Core Entities

#### Victims Table

Represents documented individuals who lost their lives.

```typescript
victims {
  id: string (UUID, primary key)
  full_name_fa: string (Persian name)
  full_name_en: string (English name)
  age: number (nullable)
  gender: 'male' | 'female' | 'child' | 'unknown'
  city: string
  date_of_death: date
  photo_url: string (nullable, Vercel Blob URL)
  notes_fa: string (nullable, Persian notes)
  notes_en: string (nullable, English notes)
  created_at: timestamp
  updated_at: timestamp
}
```

**Validation Rules**:
- `full_name_fa` or `full_name_en` must be provided (at least one)
- `date_of_death` is required
- `city` is required
- `photo_url` must be valid URL if provided
- `age` must be positive integer if provided

**Indexes**:
- `idx_victims_city` on `city`
- `idx_victims_gender` on `gender`
- `idx_victims_date_of_death` on `date_of_death`
- `idx_victims_created_at` on `created_at`

#### News Table

Represents documented events or news articles.

```typescript
news {
  id: string (UUID, primary key)
  slug: string (unique, URL-friendly identifier)
  title_fa: string (Persian title)
  title_en: string (English title)
  publication_date: date
  country: string
  excerpt_separator_position: number (nullable, character position for excerpt)
  content_fa: text (Persian rich text content)
  content_en: text (English rich text content)
  image_url: string (nullable, Vercel Blob URL)
  video_url: string (nullable, Vercel Blob URL)
  audio_url: string (nullable, Vercel Blob URL)
  created_at: timestamp
  updated_at: timestamp
}
```

**Validation Rules**:
- `slug` must be unique and URL-safe
- `title_fa` or `title_en` must be provided (at least one)
- `publication_date` is required
- `country` is required
- `content_fa` or `content_en` must be provided (at least one)
- `excerpt_separator_position` must be within content length if provided
- Media URLs must be valid if provided

**Indexes**:
- `idx_news_slug` on `slug` (unique)
- `idx_news_publication_date` on `publication_date`
- `idx_news_country` on `country`
- `idx_news_created_at` on `created_at`

#### News Cities Junction Table

Links news items to multiple cities.

```typescript
news_cities {
  id: string (UUID, primary key)
  news_id: string (foreign key -> news.id)
  city: string
  created_at: timestamp
}
```

**Validation Rules**:
- `news_id` must reference existing news item
- `city` is required
- Unique constraint on `(news_id, city)` pair

**Indexes**:
- `idx_news_cities_news_id` on `news_id`
- `idx_news_cities_city` on `city`

#### Statements Table

Represents official declarations or position statements.

```typescript
statements {
  id: string (UUID, primary key)
  slug: string (unique, URL-friendly identifier)
  title_fa: string (Persian title)
  title_en: string (English title)
  publication_date: date
  content_fa: text (Persian rich text content)
  content_en: text (English rich text content)
  image_url: string (nullable, Vercel Blob URL)
  created_at: timestamp
  updated_at: timestamp
}
```

**Validation Rules**:
- `slug` must be unique and URL-safe
- `title_fa` or `title_en` must be provided (at least one)
- `publication_date` is required
- `content_fa` or `content_en` must be provided (at least one)
- `image_url` must be valid URL if provided

**Indexes**:
- `idx_statements_slug` on `slug` (unique)
- `idx_statements_publication_date` on `publication_date`
- `idx_statements_created_at` on `created_at`

#### Media Table

Represents photos and videos documenting events.

```typescript
media {
  id: string (UUID, primary key)
  media_type: 'photo' | 'video'
  country: string
  city: string
  district: string (nullable, neighborhood/district)
  event_date: date (nullable)
  description_fa: string (nullable, Persian description)
  description_en: string (nullable, English description)
  file_url: string (Vercel Blob URL)
  thumbnail_url: string (nullable, Vercel Blob URL for videos)
  created_at: timestamp
  updated_at: timestamp
}
```

**Validation Rules**:
- `media_type` is required and must be 'photo' or 'video'
- `country` is required
- `city` is required
- `file_url` is required and must be valid URL
- `description_fa` or `description_en` should be provided (at least one recommended)
- `thumbnail_url` recommended for videos

**Indexes**:
- `idx_media_type` on `media_type`
- `idx_media_country` on `country`
- `idx_media_city` on `city`
- `idx_media_event_date` on `event_date`
- `idx_media_created_at` on `created_at`

#### Admin Users Table

Represents authorized content managers (managed by Neon Auth, but we may need a reference table).

```typescript
admin_users {
  id: string (UUID, primary key)
  email: string (unique)
  name: string (nullable)
  created_at: timestamp
  updated_at: timestamp
}
```

**Note**: Authentication is handled by Neon Auth. This table may be used for additional admin metadata if needed.

## Relationships

1. **News ↔ Cities**: Many-to-many via `news_cities` junction table
   - One news item can reference multiple cities
   - One city can be referenced by multiple news items

2. **All entities are independent**: Victims, News, Statements, and Media are standalone entities with no foreign key relationships between them.

## State Transitions

### News Item Lifecycle

```
Draft → Published → Archived (optional)
```

- **Draft**: Created but not yet published (publication_date in future)
- **Published**: Available on public site (publication_date <= today)
- **Archived**: Can be hidden from main listings (future enhancement)

### Media Item States

```
Pending Review → Approved → Published
```

- **Pending Review**: Uploaded but not yet approved for public display
- **Approved**: Reviewed and approved (adheres to ethical constraints)
- **Published**: Visible on public media gallery

## Data Validation Rules

### Cross-Entity Validation

1. **Slug Uniqueness**: News and Statements slugs must be unique across their respective tables
2. **Date Consistency**: `publication_date` and `event_date` should be reasonable (not in distant future)
3. **Media Type Validation**: Video files should have `media_type = 'video'`, image files should have `media_type = 'photo'`
4. **Bilingual Content**: At least one language version (FA or EN) must be provided for all text fields

### Content Validation

1. **Excerpt Separator**: Must be within content length bounds
2. **Rich Text**: Content fields support HTML/markdown (sanitized on input)
3. **URL Validation**: All blob URLs must be valid Vercel Blob URLs
4. **File Size**: Enforced at upload time (not in database schema)

## Derived Data / Computed Fields

### Victim Statistics

Computed from `victims` table:
- Total killed: `COUNT(*) WHERE date_of_death IS NOT NULL`
- By gender: `COUNT(*) GROUP BY gender`
- Breakdown: Women, Men, Children (where `gender = 'child'` or `age < 18`)

These statistics are computed on-demand or cached with revalidation on victim data changes.

### News Excerpts

Computed from `news` table:
- If `excerpt_separator_position` is set: content up to that position
- Otherwise: first paragraph or first 300 characters

## Data Migration Considerations

1. **Initial Schema**: All tables created via Drizzle migrations
2. **Future Enhancements**: 
   - Archive flags for news/statements
   - Media approval workflow
   - Content versioning (optional)
   - Soft deletes (optional)

## Performance Optimizations

1. **Indexes**: All foreign keys and frequently queried fields are indexed
2. **Pagination**: All list endpoints support pagination (limit/offset or cursor-based)
3. **Caching**: Victim statistics cached with revalidation on changes
4. **Query Optimization**: Use Drizzle's query builder for efficient joins and filters
