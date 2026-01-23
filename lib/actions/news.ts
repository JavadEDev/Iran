"use server";

import { db } from "@/lib/db";
import { news, newsCities } from "@/lib/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { isAuthenticated } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/blob";
import type { NewsPreview, NewsDetail } from "@/lib/types";
import type { Language } from "@/lib/i18n/config";
import { getLocalizedText } from "@/lib/i18n/server";

function extractExcerpt(content: string, separatorPosition: number | null): string {
  if (separatorPosition && separatorPosition > 0 && separatorPosition < content.length) {
    return content.substring(0, separatorPosition).trim();
  }
  // Fallback to first paragraph or first 300 characters
  const firstParagraph = content.split("\n\n")[0];
  if (firstParagraph.length > 300) {
    return firstParagraph.substring(0, 300).trim() + "...";
  }
  return firstParagraph.trim();
}

export async function getFeaturedNews(lang: Language): Promise<NewsPreview | null> {
  const latestNews = await db
    .select()
    .from(news)
    .orderBy(desc(news.publicationDate))
    .limit(1);

  if (latestNews.length === 0) {
    return null;
  }

  const item = latestNews[0];
  const cities = await db
    .select({ city: newsCities.city })
    .from(newsCities)
    .where(eq(newsCities.newsId, item.id));

  const title = getLocalizedText({ fa: item.titleFa, en: item.titleEn }, lang) || "";
  const content = getLocalizedText({ fa: item.contentFa, en: item.contentEn }, lang) || "";

  const excerpt = extractExcerpt(content, item.excerptSeparatorPosition);

  return {
    id: item.id,
    slug: item.slug,
    title,
    publicationDate: new Date(item.publicationDate),
    country: item.country,
    cities: cities.map((c) => c.city),
    excerpt,
    thumbnailUrl: item.imageUrl,
  };
}

export async function getRecentNews(lang: Language, limit: number = 5): Promise<NewsPreview[]> {
  const newsItems = await db
    .select()
    .from(news)
    .orderBy(desc(news.publicationDate))
    .limit(limit + 1); // Get one extra to skip the featured one

  if (newsItems.length === 0) {
    return [];
  }

  // Skip the first one (it's the featured news)
  const items = newsItems.slice(1, limit + 1);

  const results: NewsPreview[] = [];

  for (const item of items) {
    const cities = await db
      .select({ city: newsCities.city })
      .from(newsCities)
      .where(eq(newsCities.newsId, item.id));

    const title = getLocalizedText({ fa: item.titleFa, en: item.titleEn }, lang) || "";
    const content = getLocalizedText({ fa: item.contentFa, en: item.contentEn }, lang) || "";

    const excerpt = extractExcerpt(content, item.excerptSeparatorPosition);

    results.push({
      id: item.id,
      slug: item.slug,
      title,
      publicationDate: new Date(item.publicationDate),
      country: item.country,
      cities: cities.map((c) => c.city),
      excerpt,
      thumbnailUrl: item.imageUrl,
    });
  }

  return results;
}

export async function getNewsList(lang: Language, page: number = 1, pageSize: number = 10): Promise<{
  items: NewsPreview[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}> {
  const offset = (page - 1) * pageSize;

  const [newsItems, totalResult] = await Promise.all([
    db
      .select()
      .from(news)
      .orderBy(desc(news.publicationDate))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(news),
  ]);

  const total = Number(totalResult[0]?.count || 0);
  const results: NewsPreview[] = [];

  for (const item of newsItems) {
    const cities = await db
      .select({ city: newsCities.city })
      .from(newsCities)
      .where(eq(newsCities.newsId, item.id));

    const title = getLocalizedText({ fa: item.titleFa, en: item.titleEn }, lang) || "";
    const content = getLocalizedText({ fa: item.contentFa, en: item.contentEn }, lang) || "";
    const excerpt = extractExcerpt(content, item.excerptSeparatorPosition);

    results.push({
      id: item.id,
      slug: item.slug,
      title,
      publicationDate: new Date(item.publicationDate),
      country: item.country,
      cities: cities.map((c) => c.city),
      excerpt,
      thumbnailUrl: item.imageUrl,
    });
  }

  return {
    items: results,
    total,
    page,
    pageSize,
    hasMore: offset + pageSize < total,
  };
}

export async function getNewsBySlug(slug: string, lang: Language): Promise<NewsDetail | null> {
  const newsItems = await db.select().from(news).where(eq(news.slug, slug)).limit(1);

  if (newsItems.length === 0) {
    return null;
  }

  const item = newsItems[0];
  const cities = await db
    .select({ city: newsCities.city })
    .from(newsCities)
    .where(eq(newsCities.newsId, item.id));

  const title = getLocalizedText({ fa: item.titleFa, en: item.titleEn }, lang);
  const content = getLocalizedText({ fa: item.contentFa, en: item.contentEn }, lang);

  return {
    id: item.id,
    slug: item.slug,
    titleFa: item.titleFa,
    titleEn: item.titleEn,
    publicationDate: new Date(item.publicationDate),
    country: item.country,
    cities: cities.map((c) => c.city),
    excerptSeparatorPosition: item.excerptSeparatorPosition,
    contentFa: item.contentFa,
    contentEn: item.contentEn,
    imageUrl: item.imageUrl,
    videoUrl: item.videoUrl,
    audioUrl: item.audioUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    fullContent: content || "",
    media: {
      image: item.imageUrl,
      video: item.videoUrl,
      audio: item.audioUrl,
    },
  };
}

export async function createNews(input: {
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
}): Promise<{ success: true; data: any } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    let imageUrl: string | null = null;
    let videoUrl: string | null = null;
    let audioUrl: string | null = null;

    if (input.imageFile) {
      imageUrl = await uploadFile(input.imageFile, `news/${input.slug}-image`);
    }
    if (input.videoFile) {
      videoUrl = await uploadFile(input.videoFile, `news/${input.slug}-video`);
    }
    if (input.audioFile) {
      audioUrl = await uploadFile(input.audioFile, `news/${input.slug}-audio`);
    }

    const [newNews] = await db
      .insert(news)
      .values({
        slug: input.slug,
        titleFa: input.titleFa || null,
        titleEn: input.titleEn || null,
        publicationDate: input.publicationDate.toISOString().split('T')[0],
        country: input.country,
        excerptSeparatorPosition: input.excerptSeparatorPosition || null,
        contentFa: input.contentFa || null,
        contentEn: input.contentEn || null,
        imageUrl,
        videoUrl,
        audioUrl,
      })
      .returning();

    // Insert cities
    for (const city of input.cities) {
      await db.insert(newsCities).values({
        newsId: newNews.id,
        city,
      });
    }

    return { success: true, data: newNews };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create news" };
  }
}

export async function updateNews(
  slug: string,
  input: Partial<{
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
  }>
): Promise<{ success: true; data: any } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "News not found" };
    }

    let imageUrl = existing[0].imageUrl;
    let videoUrl = existing[0].videoUrl;
    let audioUrl = existing[0].audioUrl;

    if (input.imageFile) {
      if (imageUrl) await deleteFile(imageUrl);
      imageUrl = await uploadFile(input.imageFile, `news/${slug}-image`);
    }
    if (input.videoFile) {
      if (videoUrl) await deleteFile(videoUrl);
      videoUrl = await uploadFile(input.videoFile, `news/${slug}-video`);
    }
    if (input.audioFile) {
      if (audioUrl) await deleteFile(audioUrl);
      audioUrl = await uploadFile(input.audioFile, `news/${slug}-audio`);
    }

    const [updated] = await db
      .update(news)
      .set({
        slug: input.slug || existing[0].slug,
        titleFa: input.titleFa !== undefined ? input.titleFa : existing[0].titleFa,
        titleEn: input.titleEn !== undefined ? input.titleEn : existing[0].titleEn,
        publicationDate: input.publicationDate
          ? input.publicationDate.toISOString().split('T')[0]
          : existing[0].publicationDate,
        country: input.country || existing[0].country,
        excerptSeparatorPosition: input.excerptSeparatorPosition !== undefined ? input.excerptSeparatorPosition : existing[0].excerptSeparatorPosition,
        contentFa: input.contentFa !== undefined ? input.contentFa : existing[0].contentFa,
        contentEn: input.contentEn !== undefined ? input.contentEn : existing[0].contentEn,
        imageUrl,
        videoUrl,
        audioUrl,
        updatedAt: new Date(),
      })
      .where(eq(news.slug, slug))
      .returning();

    // Update cities if provided
    if (input.cities) {
      await db.delete(newsCities).where(eq(newsCities.newsId, updated.id));
      for (const city of input.cities) {
        await db.insert(newsCities).values({
          newsId: updated.id,
          city,
        });
      }
    }

    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update news" };
  }
}

export async function deleteNews(slug: string): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(news).where(eq(news.slug, slug)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "News not found" };
    }

    // Delete media files
    if (existing[0].imageUrl) await deleteFile(existing[0].imageUrl);
    if (existing[0].videoUrl) await deleteFile(existing[0].videoUrl);
    if (existing[0].audioUrl) await deleteFile(existing[0].audioUrl);

    // Delete cities
    await db.delete(newsCities).where(eq(newsCities.newsId, existing[0].id));
    // Delete news
    await db.delete(news).where(eq(news.slug, slug));

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete news" };
  }
}
