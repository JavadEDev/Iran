import { z } from "zod";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2MB
const MAX_NAME_LENGTH = 500;
const MAX_CITY_LENGTH = 200;
const MAX_NOTES_LENGTH = 5000;
const MAX_SOURCE_LENGTH = 2000;

const genderSchema = z.enum(["male", "female", "child", "unknown"]);

const photoFileSchema = z
  .union([
    z.instanceof(File).refine((f) => f.size <= MAX_PHOTO_BYTES, {
      message: "Photo must be 2MB or less",
    }),
    z.undefined(),
  ])
  .optional();

export const victimCreateSchema = z.object({
  fullNameFa: z.string().max(MAX_NAME_LENGTH).optional(),
  fullNameEn: z.string().max(MAX_NAME_LENGTH).optional(),
  age: z.number().int().min(0).max(150).optional(),
  gender: genderSchema,
  city: z.string().min(1, "City is required").max(MAX_CITY_LENGTH),
  cityEn: z.string().max(MAX_CITY_LENGTH).optional(),
  dateOfDeath: z.coerce.date(),
  notesFa: z.string().max(MAX_NOTES_LENGTH).optional(),
  notesEn: z.string().max(MAX_NOTES_LENGTH).optional(),
  source: z.string().max(MAX_SOURCE_LENGTH).optional(),
  photoFile: photoFileSchema,
});

export const victimUpdateSchema = z.object({
  fullNameFa: z.string().max(MAX_NAME_LENGTH).optional(),
  fullNameEn: z.string().max(MAX_NAME_LENGTH).optional(),
  age: z.number().int().min(0).max(150).optional(),
  gender: genderSchema.optional(),
  city: z.string().min(1).max(MAX_CITY_LENGTH).optional(),
  cityEn: z.string().max(MAX_CITY_LENGTH).optional(),
  dateOfDeath: z.coerce.date().optional(),
  notesFa: z.string().max(MAX_NOTES_LENGTH).optional(),
  notesEn: z.string().max(MAX_NOTES_LENGTH).optional(),
  source: z.string().max(MAX_SOURCE_LENGTH).optional(),
  photoFile: photoFileSchema,
});

export type VictimCreateInput = z.infer<typeof victimCreateSchema>;
export type VictimUpdateInput = z.infer<typeof victimUpdateSchema>;
