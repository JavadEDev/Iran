"use server";

import { db } from "@/lib/db";
import { statements } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import type { Language } from "@/lib/i18n/config";
import { getLocalizedText } from "@/lib/i18n/server";

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

export interface StatementPreview {
  id: string;
  slug: string;
  title: string;
  publicationDate: Date;
  imageUrl: string | null;
  isLatest: boolean;
}

export async function getStatementsList(lang: Language): Promise<StatementPreview[]> {
  const allStatements = await db
    .select()
    .from(statements)
    .orderBy(desc(statements.publicationDate));

  return allStatements.map((stmt, index) => ({
    id: stmt.id,
    slug: stmt.slug,
    title: getLocalizedText({ fa: stmt.titleFa, en: stmt.titleEn }, lang) || "",
    publicationDate: new Date(stmt.publicationDate),
    imageUrl: stmt.imageUrl,
    isLatest: index === 0,
  }));
}

export async function getStatementBySlug(slug: string, lang: Language): Promise<Statement | null> {
  const results = await db.select().from(statements).where(eq(statements.slug, slug)).limit(1);

  if (results.length === 0) {
    return null;
  }

  const stmt = results[0];
  return {
    id: stmt.id,
    slug: stmt.slug,
    titleFa: stmt.titleFa,
    titleEn: stmt.titleEn,
    publicationDate: new Date(stmt.publicationDate),
    contentFa: stmt.contentFa,
    contentEn: stmt.contentEn,
    imageUrl: stmt.imageUrl,
    createdAt: stmt.createdAt,
    updatedAt: stmt.updatedAt,
  };
}

export async function createStatement(input: {
  slug: string;
  titleFa?: string;
  titleEn?: string;
  publicationDate: Date;
  contentFa?: string;
  contentEn?: string;
  imageFile?: File;
}): Promise<{ success: true; data: Statement } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    let imageUrl: string | null = null;

    if (input.imageFile) {
      imageUrl = await uploadFile(input.imageFile, `statements/${input.slug}-image`);
    }

    const [newStatement] = await db
      .insert(statements)
      .values({
        slug: input.slug,
        titleFa: input.titleFa || null,
        titleEn: input.titleEn || null,
        publicationDate: input.publicationDate.toISOString().split('T')[0],
        contentFa: input.contentFa || null,
        contentEn: input.contentEn || null,
        imageUrl,
      })
      .returning();

    return {
      success: true,
      data: {
        id: newStatement.id,
        slug: newStatement.slug,
        titleFa: newStatement.titleFa,
        titleEn: newStatement.titleEn,
        publicationDate: new Date(newStatement.publicationDate),
        contentFa: newStatement.contentFa,
        contentEn: newStatement.contentEn,
        imageUrl: newStatement.imageUrl,
        createdAt: newStatement.createdAt,
        updatedAt: newStatement.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create statement" };
  }
}

export async function updateStatement(
  slug: string,
  input: Partial<{
    slug: string;
    titleFa?: string;
    titleEn?: string;
    publicationDate: Date;
    contentFa?: string;
    contentEn?: string;
    imageFile?: File;
  }>
): Promise<{ success: true; data: Statement } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(statements).where(eq(statements.slug, slug)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Statement not found" };
    }

    let imageUrl = existing[0].imageUrl;

    if (input.imageFile) {
      if (imageUrl) await deleteFile(imageUrl);
      imageUrl = await uploadFile(input.imageFile, `statements/${slug}-image`);
    }

    const [updated] = await db
      .update(statements)
      .set({
        slug: input.slug || existing[0].slug,
        titleFa: input.titleFa !== undefined ? input.titleFa : existing[0].titleFa,
        titleEn: input.titleEn !== undefined ? input.titleEn : existing[0].titleEn,
        publicationDate: input.publicationDate
          ? input.publicationDate.toISOString().split('T')[0]
          : existing[0].publicationDate,
        contentFa: input.contentFa !== undefined ? input.contentFa : existing[0].contentFa,
        contentEn: input.contentEn !== undefined ? input.contentEn : existing[0].contentEn,
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(statements.slug, slug))
      .returning();

    return {
      success: true,
      data: {
        id: updated.id,
        slug: updated.slug,
        titleFa: updated.titleFa,
        titleEn: updated.titleEn,
        publicationDate: new Date(updated.publicationDate),
        contentFa: updated.contentFa,
        contentEn: updated.contentEn,
        imageUrl: updated.imageUrl,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update statement" };
  }
}

export async function deleteStatement(slug: string): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(statements).where(eq(statements.slug, slug)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Statement not found" };
    }

    if (existing[0].imageUrl) {
      await deleteFile(existing[0].imageUrl);
    }

    await db.delete(statements).where(eq(statements.slug, slug));
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete statement" };
  }
}

export async function createStatement(input: {
  slug: string;
  titleFa?: string;
  titleEn?: string;
  publicationDate: Date;
  contentFa?: string;
  contentEn?: string;
  imageFile?: File;
}): Promise<{ success: true; data: Statement } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    let imageUrl: string | null = null;

    if (input.imageFile) {
      imageUrl = await uploadFile(input.imageFile, `statements/${input.slug}-image`);
    }

    const [newStatement] = await db
      .insert(statements)
      .values({
        slug: input.slug,
        titleFa: input.titleFa || null,
        titleEn: input.titleEn || null,
        publicationDate: input.publicationDate.toISOString().split('T')[0],
        contentFa: input.contentFa || null,
        contentEn: input.contentEn || null,
        imageUrl,
      })
      .returning();

    return {
      success: true,
      data: {
        id: newStatement.id,
        slug: newStatement.slug,
        titleFa: newStatement.titleFa,
        titleEn: newStatement.titleEn,
        publicationDate: new Date(newStatement.publicationDate),
        contentFa: newStatement.contentFa,
        contentEn: newStatement.contentEn,
        imageUrl: newStatement.imageUrl,
        createdAt: newStatement.createdAt,
        updatedAt: newStatement.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to create statement" };
  }
}

export async function updateStatement(
  slug: string,
  input: Partial<{
    slug: string;
    titleFa?: string;
    titleEn?: string;
    publicationDate: Date;
    contentFa?: string;
    contentEn?: string;
    imageFile?: File;
  }>
): Promise<{ success: true; data: Statement } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(statements).where(eq(statements.slug, slug)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Statement not found" };
    }

    let imageUrl = existing[0].imageUrl;

    if (input.imageFile) {
      if (imageUrl) await deleteFile(imageUrl);
      imageUrl = await uploadFile(input.imageFile, `statements/${slug}-image`);
    }

    const [updated] = await db
      .update(statements)
      .set({
        slug: input.slug || existing[0].slug,
        titleFa: input.titleFa !== undefined ? input.titleFa : existing[0].titleFa,
        titleEn: input.titleEn !== undefined ? input.titleEn : existing[0].titleEn,
        publicationDate: input.publicationDate
          ? input.publicationDate.toISOString().split('T')[0]
          : existing[0].publicationDate,
        contentFa: input.contentFa !== undefined ? input.contentFa : existing[0].contentFa,
        contentEn: input.contentEn !== undefined ? input.contentEn : existing[0].contentEn,
        imageUrl,
        updatedAt: new Date(),
      })
      .where(eq(statements.slug, slug))
      .returning();

    return {
      success: true,
      data: {
        id: updated.id,
        slug: updated.slug,
        titleFa: updated.titleFa,
        titleEn: updated.titleEn,
        publicationDate: new Date(updated.publicationDate),
        contentFa: updated.contentFa,
        contentEn: updated.contentEn,
        imageUrl: updated.imageUrl,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      },
    };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to update statement" };
  }
}

export async function deleteStatement(slug: string): Promise<{ success: true } | { success: false; error: string }> {
  if (!(await isAuthenticated())) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const existing = await db.select().from(statements).where(eq(statements.slug, slug)).limit(1);
    if (existing.length === 0) {
      return { success: false, error: "Statement not found" };
    }

    if (existing[0].imageUrl) {
      await deleteFile(existing[0].imageUrl);
    }

    await db.delete(statements).where(eq(statements.slug, slug));
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete statement" };
  }
}
