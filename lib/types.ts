/**
 * TypeScript Type Definitions
 * Bilingual Iranian Revolution Memorial Website
 */

export type Gender = "male" | "female" | "child" | "unknown";
export type MediaType = "photo" | "video";
export type Language = "fa" | "en";

export interface Victim {
  id: string;
  fullNameFa: string | null;
  fullNameEn: string | null;
  age: number | null;
  gender: Gender;
  city: string;
  cityEn: string | null;
  dateOfDeath: Date;
  photoUrl: string | null;
  notesFa: string | null;
  notesEn: string | null;
  /**
   * Optional source links (e.g. Telegram, X, Instagram).
   * Can contain one or multiple URLs separated by newlines or commas.
   */
  source: string | null;
  createdAt: Date;
  updatedAt: Date;
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

export interface NewsPreview {
  id: string;
  slug: string;
  title: string;
  publicationDate: Date;
  country: string;
  cities: string[];
  excerpt: string;
  thumbnailUrl: string | null;
}

export interface NewsDetail extends News {
  fullContent: string;
  media: {
    image: string | null;
    video: string | null;
    audio: string | null;
  };
}

export interface VictimFilters {
  city?: string;
  gender?: Gender;
  minAge?: number;
  maxAge?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

export interface VictimSortOptions {
  field: "dateOfDeath" | "createdAt" | "name";
  direction: "asc" | "desc";
}

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

export interface MediaFilters {
  country?: string;
  city?: string;
  mediaType?: MediaType;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface MediaSortOptions {
  field: "eventDate" | "createdAt" | "location";
  direction: "asc" | "desc";
}

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
