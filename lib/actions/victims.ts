"use server";

import { db } from "@/lib/db";
import { victims } from "@/lib/db/schema";
import { eq, and, gte, lte, sql, asc, desc, or, ilike } from "drizzle-orm";
import type {
  VictimStats,
  Victim,
  VictimFilters,
  VictimSortOptions,
  Gender,
} from "@/lib/types";
import {
  victimCreateSchema,
  victimUpdateSchema,
} from "@/lib/validation/victim";

export async function getVictimStats(): Promise<VictimStats> {
  const total = await db.select({ count: sql<number>`count(*)` }).from(victims);
  const totalCount = Number(total[0]?.count || 0);

  const byGender = await db
    .select({
      gender: victims.gender,
      count: sql<number>`count(*)`,
    })
    .from(victims)
    .groupBy(victims.gender);

  const stats: VictimStats = {
    total: totalCount,
    byGender: {
      male: 0,
      female: 0,
      child: 0,
      unknown: 0,
    },
  };

  byGender.forEach((item) => {
    const count = Number(item.count);
    if (item.gender === "male") stats.byGender.male = count;
    else if (item.gender === "female") stats.byGender.female = count;
    else if (item.gender === "child") stats.byGender.child = count;
    else if (item.gender === "unknown") stats.byGender.unknown = count;
  });

  return stats;
}

export async function getVictims(
  filters?: VictimFilters,
  sort?: VictimSortOptions,
  page: number = 1,
  pageSize: number = 20
): Promise<{
  items: Victim[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}> {
  const offset = (page - 1) * pageSize;
  const conditions = [];

  if (filters) {
    if (filters.city) {
      const trimmed = filters.city.trim();
      if (trimmed) {
        const like = `%${trimmed}%`;
        conditions.push(
          or(ilike(victims.city, like), ilike(victims.cityEn, like))
        );
      }
    }
    if (filters.gender) {
      conditions.push(eq(victims.gender, filters.gender));
    }
    if (filters.search) {
      const trimmed = filters.search.trim();
      if (trimmed) {
        const like = `%${trimmed}%`;
        const orConditions = [
          ilike(victims.fullNameFa, like),
          ilike(victims.fullNameEn, like),
          ilike(victims.city, like),
          ilike(victims.cityEn, like),
          ilike(victims.notesFa, like),
          ilike(victims.notesEn, like),
          ilike(victims.source, like),
        ];
        if (["male", "female", "child", "unknown"].includes(trimmed)) {
          orConditions.push(eq(victims.gender, trimmed as Gender));
        }
        if (!Number.isNaN(Number(trimmed))) {
          orConditions.push(eq(victims.age, Number(trimmed)));
        }
        conditions.push(or(...orConditions));
      }
    }
    if (filters.minAge !== undefined) {
      conditions.push(gte(victims.age, filters.minAge));
    }
    if (filters.maxAge !== undefined) {
      conditions.push(lte(victims.age, filters.maxAge));
    }
    if (filters.dateFrom) {
      conditions.push(
        gte(victims.dateOfDeath, filters.dateFrom.toISOString().split("T")[0])
      );
    }
    if (filters.dateTo) {
      conditions.push(
        lte(victims.dateOfDeath, filters.dateTo.toISOString().split("T")[0])
      );
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Sorting
  let orderBy;
  if (sort) {
    const direction = sort.direction === "asc" ? asc : desc;
    if (sort.field === "dateOfDeath") {
      orderBy = direction(victims.dateOfDeath);
    } else if (sort.field === "createdAt") {
      orderBy = direction(victims.createdAt);
    } else if (sort.field === "name") {
      orderBy = direction(victims.fullNameEn || victims.fullNameFa || sql`''`);
    } else {
      orderBy = desc(victims.dateOfDeath);
    }
  } else {
    orderBy = desc(victims.dateOfDeath);
  }

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(victims)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(victims)
      .where(whereClause),
  ]);

  const total = Number(totalResult[0]?.count || 0);

  return {
    items: items.map((item) => ({
      id: item.id,
      fullNameFa: item.fullNameFa,
      fullNameEn: item.fullNameEn,
      age: item.age,
      gender: item.gender as Gender,
      city: item.city,
      cityEn: item.cityEn,
      dateOfDeath: new Date(item.dateOfDeath),
      photoUrl: item.photoUrl,
      notesFa: item.notesFa,
      notesEn: item.notesEn,
      source: item.source,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    total,
    page,
    pageSize,
    hasMore: offset + pageSize < total,
  };
}

export async function createVictim(input: {
  fullNameFa?: string;
  fullNameEn?: string;
  age?: number;
  gender: Gender;
  city: string;
  cityEn?: string;
  dateOfDeath: Date;
  photoFile?: File;
  notesFa?: string;
  notesEn?: string;
  source?: string;
}): Promise<
  { success: true; data: Victim } | { success: false; error: string }
> {
  const { isAuthenticated } = await import("@/lib/auth");
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = victimCreateSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      Object.values(first).flat().find(Boolean) ||
      parsed.error.message ||
      "Validation failed";
    return { success: false, error: String(msg) };
  }
  const data = parsed.data;

  try {
    let photoUrl: string | null = null;

    if (data.photoFile) {
      const { uploadFile } = await import("@/lib/blob");
      photoUrl = await uploadFile(
        data.photoFile,
        `victims/${Date.now()}-${data.photoFile.name}`
      );
    }

    const [newVictim] = await db
      .insert(victims)
      .values({
        fullNameFa: data.fullNameFa || null,
        fullNameEn: data.fullNameEn || null,
        age: data.age ?? null,
        gender: data.gender,
        city: data.city,
        cityEn: data.cityEn || null,
        dateOfDeath: data.dateOfDeath.toISOString().split("T")[0],
        photoUrl,
        notesFa: data.notesFa || null,
        notesEn: data.notesEn || null,
        source: data.source || null,
      })
      .returning();

    return {
      success: true,
      data: {
        id: newVictim.id,
        fullNameFa: newVictim.fullNameFa,
        fullNameEn: newVictim.fullNameEn,
        age: newVictim.age,
        gender: newVictim.gender as Gender,
        city: newVictim.city,
        cityEn: newVictim.cityEn,
        dateOfDeath: new Date(newVictim.dateOfDeath),
        photoUrl: newVictim.photoUrl,
        notesFa: newVictim.notesFa,
        notesEn: newVictim.notesEn,
        createdAt: newVictim.createdAt,
        updatedAt: newVictim.updatedAt,
        source: newVictim.source,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create victim",
    };
  }
}

export async function updateVictim(
  id: string,
  input: Partial<{
    fullNameFa?: string;
    fullNameEn?: string;
    age?: number;
    gender: Gender;
    city: string;
    cityEn?: string;
    dateOfDeath: Date;
    photoFile?: File;
    notesFa?: string;
    notesEn?: string;
    source?: string;
  }>
): Promise<
  { success: true; data: Victim } | { success: false; error: string }
> {
  const { isAuthenticated } = await import("@/lib/auth");
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = victimUpdateSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.flatten().fieldErrors;
    const msg =
      Object.values(first).flat().find(Boolean) ||
      parsed.error.message ||
      "Validation failed";
    return { success: false, error: String(msg) };
  }
  const data = parsed.data;

  try {
    const existing = await db
      .select()
      .from(victims)
      .where(eq(victims.id, id))
      .limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Victim not found" };
    }

    let photoUrl = existing[0].photoUrl;

    if (data.photoFile) {
      const { uploadFile, deleteFile } = await import("@/lib/blob");
      if (photoUrl) {
        await deleteFile(photoUrl);
      }
      photoUrl = await uploadFile(
        data.photoFile,
        `victims/${Date.now()}-${data.photoFile.name}`
      );
    }

    const [updated] = await db
      .update(victims)
      .set({
        fullNameFa:
          data.fullNameFa !== undefined
            ? data.fullNameFa
            : existing[0].fullNameFa,
        fullNameEn:
          data.fullNameEn !== undefined
            ? data.fullNameEn
            : existing[0].fullNameEn,
        age: data.age !== undefined ? data.age : existing[0].age,
        gender: data.gender ?? existing[0].gender,
        city: data.city ?? existing[0].city,
        cityEn: data.cityEn ?? existing[0].cityEn,
        dateOfDeath: data.dateOfDeath
          ? data.dateOfDeath.toISOString().split("T")[0]
          : existing[0].dateOfDeath,
        photoUrl,
        notesFa:
          data.notesFa !== undefined ? data.notesFa : existing[0].notesFa,
        notesEn:
          data.notesEn !== undefined ? data.notesEn : existing[0].notesEn,
        source: data.source !== undefined ? data.source : existing[0].source,
        updatedAt: new Date(),
      })
      .where(eq(victims.id, id))
      .returning();

    return {
      success: true,
      data: {
        id: updated.id,
        fullNameFa: updated.fullNameFa,
        fullNameEn: updated.fullNameEn,
        age: updated.age,
        gender: updated.gender as Gender,
        city: updated.city,
        cityEn: updated.cityEn,
        dateOfDeath: new Date(updated.dateOfDeath),
        photoUrl: updated.photoUrl,
        notesFa: updated.notesFa,
        notesEn: updated.notesEn,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
        source: updated.source,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update victim",
    };
  }
}

export async function deleteVictim(
  id: string
): Promise<{ success: true } | { success: false; error: string }> {
  const { isAuthenticated } = await import("@/lib/auth");
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db
      .select()
      .from(victims)
      .where(eq(victims.id, id))
      .limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Victim not found" };
    }

    if (existing[0].photoUrl) {
      const { deleteFile } = await import("@/lib/blob");
      await deleteFile(existing[0].photoUrl);
    }

    await db.delete(victims).where(eq(victims.id, id));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete victim",
    };
  }
}
