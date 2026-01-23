/**
 * TypeScript Type Definitions
 * Bilingual Iranian Revolution Memorial Website
 * 
 * These types represent the data contracts for Server Actions and components.
 */

// ============================================================================
// Core Entity Types
// ============================================================================

export type Gender = 'male' | 'female' | 'child' | 'unknown';

export type MediaType = 'photo' | 'video';

export type Language = 'fa' | 'en';

// ============================================================================
// Victim Types
// ============================================================================

export interface Victim {
  id: string;
  fullNameFa: string | null;
  fullNameEn: string | null;
  age: number | null;
  gender: Gender;
  city: string;
  dateOfDeath: Date;
  photoUrl: string | null;
  notesFa: string | null;
  notesEn: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VictimInput {
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

export interface VictimFilters {
  city?: string;
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface VictimSortOptions {
  field: 'dateOfDeath' | 'createdAt' | 'name';
  direction: 'asc' | 'desc';
}

export interface VictimStats {
  total: number;
  byGender: {
    male: number;
    female: number;
    child: number;
    unknown: number;
  };
}

// ============================================================================
// News Types
// ============================================================================

export interface News {
  id: string;
  slug: string;
  titleFa: string | null;
  titleEn: string | null;
  publicationDate: Date;
  country: string;
  cities: string[];
  excerptSeparatorPosition: number | null;
  contentFa: string | null;
  contentEn: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  audioUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsInput {
  slug: string;
  titleFa?: string;
  titleEn?: string;
  publicationDate: Date;
  country: string;
  cities: string[];
  excerptSeparatorPosition?: number;
  contentFa?: string;
  contentEn?: string;
  imageFile?: File;
  videoFile?: File;
  audioFile?: File;
}

export interface NewsPreview {
  id: string;
  slug: string;
  title: string; // Localized
  publicationDate: Date;
  country: string;
  cities: string[];
  excerpt: string; // Localized, truncated at separator
  thumbnailUrl: string | null;
}

export interface NewsDetail extends News {
  fullContent: string; // Localized
  media: {
    image: string | null;
    video: string | null;
    audio: string | null;
  };
}

// ============================================================================
// Statement Types
// ============================================================================

export interface Statement {
  id: string;
  slug: string;
  titleFa: string | null;
  titleEn: string | null;
  publicationDate: Date;
  contentFa: string | null;
  contentEn: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatementInput {
  slug: string;
  titleFa?: string;
  titleEn?: string;
  publicationDate: Date;
  contentFa?: string;
  contentEn?: string;
  imageFile?: File;
}

export interface StatementPreview {
  id: string;
  slug: string;
  title: string; // Localized
  publicationDate: Date;
  imageUrl: string | null;
  isLatest: boolean;
}

// ============================================================================
// Media Types
// ============================================================================

export interface MediaItem {
  id: string;
  mediaType: MediaType;
  country: string;
  city: string;
  district: string | null;
  eventDate: Date | null;
  descriptionFa: string | null;
  descriptionEn: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaInput {
  mediaType: MediaType;
  country: string;
  city: string;
  district?: string;
  eventDate?: Date;
  descriptionFa?: string;
  descriptionEn?: string;
  file: File;
}

export interface MediaFilters {
  country?: string;
  city?: string;
  mediaType?: MediaType;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface MediaSortOptions {
  field: 'eventDate' | 'createdAt' | 'location';
  direction: 'asc' | 'desc';
}

// ============================================================================
// API Response Types
// ============================================================================

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================================================
// Server Action Return Types
// ============================================================================

export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// ============================================================================
// Localization Types
// ============================================================================

export interface LocalizedContent {
  fa: string | null;
  en: string | null;
}

export interface LocalizedText {
  get(lang: Language): string;
  has(lang: Language): boolean;
}

// ============================================================================
// Homepage Section Types
// ============================================================================

export interface HomepageData {
  revolutionSection: {
    textFa: string;
    textEn: string;
    leaderImageUrl: string;
    leaderIntroFa: string;
    leaderIntroEn: string;
  };
  dictatorshipSection: {
    textFa: string;
    textEn: string;
    images: string[];
  };
  victimStats: VictimStats;
  featuredNews: NewsPreview | null;
  recentNews: NewsPreview[];
}
