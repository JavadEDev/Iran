"use server";

import { db } from "@/lib/db";
import { media } from "@/lib/db/schema";
import { eq, and, gte, lte, sql, asc, desc } from "drizzle-orm";
import type { MediaItem, MediaFilters, MediaSortOptions, MediaType } from "@/lib/types";
import { isAuthenticated } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/blob";

export async function getMediaList(
  filters?: MediaFilters,
  sort?: MediaSortOptions,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  items: MediaItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}> {
  const offset = (page - 1) * pageSize;
  const conditions = [];

  if (filters) {
    if (filters.country) {
      conditions.push(eq(media.country, filters.country));
    }
    if (filters.city) {
      conditions.push(eq(media.city, filters.city));
    }
    if (filters.mediaType) {
      conditions.push(eq(media.mediaType, filters.mediaType));
    }
    if (filters.dateFrom && media.eventDate) {
      conditions.push(gte(media.eventDate, filters.dateFrom.toISOString().split('T')[0]));
    }
    if (filters.dateTo && media.eventDate) {
      conditions.push(lte(media.eventDate, filters.dateTo.toISOString().split('T')[0]));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Sorting
  let orderBy;
  if (sort) {
    const direction = sort.direction === 'asc' ? asc : desc;
    if (sort.field === 'eventDate') {
      orderBy = direction(media.eventDate || media.createdAt);
    } else if (sort.field === 'createdAt') {
      orderBy = direction(media.createdAt);
    } else if (sort.field === 'location') {
      // Sort by country then city
      orderBy = [asc(media.country), asc(media.city)];
    } else {
      orderBy = desc(media.createdAt);
    }
  } else {
    orderBy = desc(media.createdAt);
  }

  const orderByArray = Array.isArray(orderBy) ? orderBy : [orderBy];

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(media)
      .where(whereClause)
      .orderBy(...orderByArray)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(media)
      .where(whereClause),
  ]);

  const total = Number(totalResult[0]?.count || 0);

  return {
    items: items.map((item) => ({
      id: item.id,
      mediaType: item.mediaType as MediaType,
      country: item.country,
      city: item.city,
      district: item.district,
      eventDate: item.eventDate ? new Date(item.eventDate) : null,
      descriptionFa: item.descriptionFa,
      descriptionEn: item.descriptionEn,
      fileUrl: item.fileUrl,
      thumbnailUrl: item.thumbnailUrl,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    total,
    page,
    pageSize,
    hasMore: offset + pageSize < total,
  };
}

export async function createMedia(input: {
  mediaType: MediaType;
  country: string;
  city: string;
  district?: string;
  eventDate?: Date;
  descriptionFa?: string;
  descriptionEn?: string;
  file: File;
}): Promise<{ success: true; data: MediaItem } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const fileUrl = await uploadFile(input.file, `media/${Date.now()}-${input.file.name}`);

    const [newMedia] = await db
      .insert(media)
      .values({
        mediaType: input.mediaType,
        country: input.country,
        city: input.city,
        district: input.district || null,
        eventDate: input.eventDate ? input.eventDate.toISOString().split('T')[0] : null,
        descriptionFa: input.descriptionFa || null,
        descriptionEn: input.descriptionEn || null,
        fileUrl,
        thumbnailUrl: null, // Could generate thumbnail for videos
      })
      .returning();

    return {
      success: true,
      data: {
        id: newMedia.id,
        mediaType: newMedia.mediaType as MediaType,
        country: newMedia.country,
        city: newMedia.city,
        district: newMedia.district,
        eventDate: newMedia.eventDate ? new Date(newMedia.eventDate) : null,
        descriptionFa: newMedia.descriptionFa,
        descriptionEn: newMedia.descriptionEn,
        fileUrl: newMedia.fileUrl,
        thumbnailUrl: newMedia.thumbnailUrl,
        createdAt: newMedia.createdAt,
        updatedAt: newMedia.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create media" };
  }
}

export async function updateMedia(
  id: string,
  input: Partial<{
    mediaType: MediaType;
    country: string;
    city: string;
    district?: string;
    eventDate?: Date;
    descriptionFa?: string;
    descriptionEn?: string;
    file?: File;
  }>
): Promise<{ success: true; data: MediaItem } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Media not found" };
    }

    let fileUrl = existing[0].fileUrl;

    if (input.file) {
      await deleteFile(fileUrl);
      fileUrl = await uploadFile(input.file, `media/${Date.now()}-${input.file.name}`);
    }

    const [updated] = await db
      .update(media)
      .set({
        mediaType: input.mediaType || existing[0].mediaType,
        country: input.country || existing[0].country,
        city: input.city || existing[0].city,
        district: input.district !== undefined ? input.district : existing[0].district,
        eventDate: input.eventDate
          ? input.eventDate.toISOString().split('T')[0]
          : existing[0].eventDate,
        descriptionFa: input.descriptionFa !== undefined ? input.descriptionFa : existing[0].descriptionFa,
        descriptionEn: input.descriptionEn !== undefined ? input.descriptionEn : existing[0].descriptionEn,
        fileUrl,
        updatedAt: new Date(),
      })
      .where(eq(media.id, id))
      .returning();

    return {
      success: true,
      data: {
        id: updated.id,
        mediaType: updated.mediaType as MediaType,
        country: updated.country,
        city: updated.city,
        district: updated.district,
        eventDate: updated.eventDate ? new Date(updated.eventDate) : null,
        descriptionFa: updated.descriptionFa,
        descriptionEn: updated.descriptionEn,
        fileUrl: updated.fileUrl,
        thumbnailUrl: updated.thumbnailUrl,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update media" };
  }
}

export async function deleteMedia(id: string): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Media not found" };
    }

    await deleteFile(existing[0].fileUrl);
    if (existing[0].thumbnailUrl) {
      await deleteFile(existing[0].thumbnailUrl);
    }

    await db.delete(media).where(eq(media.id, id));
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete media" };
  }
}
