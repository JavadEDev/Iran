/**
 * Upsert victims from Excel (telegram_excel_ready.xlsx).
 * - Updates existing victims (gender, fullNameEn, cityEn, source).
 * - Inserts new victims and uploads their photos to Vercel Blob.
 *
 * Usage:
 *   EXCEL_PATH="C:\\...\\telegram_excel_ready.xlsx" PHOTOS_DIR="C:\\...\\photos" npx tsx lib/db/import-victims-from-excel-upsert.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import dotenv from "dotenv";
import { put } from "@vercel/blob";
import { eq, and } from "drizzle-orm";

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const EXCEL_PATH =
  process.env.EXCEL_PATH ||
  process.env.TELEGRAM_EXCEL_PATH ||
  "C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-29\\telegram_excel_ready.xlsx";

const PHOTOS_DIR =
  process.env.PHOTOS_DIR ||
  process.env.TELEGRAM_PHOTOS_DIR ||
  "C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-29\\photos";

// Persian (Jalali) month names
const PERSIAN_MONTHS: Record<string, number> = {
  فروردین: 1,
  اردیبهشت: 2,
  خرداد: 3,
  تیر: 4,
  مرداد: 5,
  شهریور: 6,
  مهر: 7,
  آبان: 8,
  آذر: 9,
  دی: 10,
  بهمن: 11,
  اسفند: 12,
};

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function persianDigitsToAscii(s: string): string {
  return s.replace(/[۰-۹]/g, (c) => String(PERSIAN_DIGITS.indexOf(c)));
}

function j2g(jy: number, jm: number, jd: number): [number, number, number] {
  let gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;
  let days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor((jy % 33) + 3) / 4 +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  gy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  let gd = days + 1;
  const salA = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  let gm = 0;
  for (; gm < 13; gm++) {
    const v = salA[gm];
    if (gd <= v) break;
    gd -= v;
  }
  return [gy, gm, gd];
}

function parsePersianDate(dateStr: string): string | null {
  const trimmed = String(dateStr || "").trim();
  if (!trimmed) return null;
  const monthPattern = Object.keys(PERSIAN_MONTHS).join("|");
  const dateRegex = new RegExp(
    `([۰-۹\\d]+)\\s+(${monthPattern})\\s+([۰-۹\\d]+)`,
    "u"
  );
  const match = trimmed.match(dateRegex);
  if (!match) return null;
  const [, dayStr, monthName, yearStr] = match;
  const day = parseInt(persianDigitsToAscii(dayStr), 10);
  const month = PERSIAN_MONTHS[monthName];
  const year = parseInt(persianDigitsToAscii(yearStr), 10);
  if (isNaN(day) || isNaN(year) || !month) return null;
  const [gy, gm, gd] = j2g(year, month, day);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
}

function clean(s: string): string {
  return String(s || "")
    .replace(/@RememberTheirNames/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

type Gender = "male" | "female" | "child" | "unknown";

function normalizeGender(val: unknown): Gender {
  const s = String(val || "")
    .trim()
    .toLowerCase();
  if (s === "male") return "male";
  if (s === "female") return "female";
  if (s === "child") return "child";
  return "unknown";
}

async function uploadToBlob(
  filePath: string,
  blobPath: string
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not set");
  }
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).slice(1) || "jpg";
  const contentType = `image/${ext === "jpg" ? "jpeg" : ext}`;
  const blob = await put(blobPath, fileBuffer, {
    access: "public",
    contentType,
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });
  return blob.url;
}

interface ExcelRow {
  fullNameFa?: string;
  fullNameEn?: string;
  cityFa?: string;
  cityEn?: string;
  dateFa?: string;
  dateEn?: string;
  imagePath?: string;
  source?: string;
  gender?: string;
}

async function main() {
  const { db } = await import("./index");
  const { victims } = await import("./schema");

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error("Excel not found:", EXCEL_PATH);
    process.exit(1);
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN is not set");
    process.exit(1);
  }

  const hasPhotosDir = fs.existsSync(PHOTOS_DIR);

  console.log("Reading Excel:", EXCEL_PATH);
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];

  console.log(`Rows: ${rows.length}`);

  let updated = 0;
  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const fullNameFa = clean(row.fullNameFa || "");
    const dateOfDeath = parsePersianDate(row.dateFa || "");
    const city = clean(row.cityFa || "");

    if (!fullNameFa || !dateOfDeath || !city) {
      skipped++;
      continue;
    }

    const gender = normalizeGender(row.gender);
    const fullNameEn = clean(row.fullNameEn || "") || null;
    const cityEn = clean(row.cityEn || "") || null;
    const source = clean(row.source || "") || null;
    const imagePath = row.imagePath ? String(row.imagePath).trim() : null;

    try {
      const existing = await db
        .select()
        .from(victims)
        .where(
          and(
            eq(victims.fullNameFa, fullNameFa),
            eq(victims.dateOfDeath, dateOfDeath)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        const victim = existing[0];
        let photoUrl = victim.photoUrl;

        if (!photoUrl && imagePath && hasPhotosDir) {
          const photoFilename = path.basename(imagePath);
          const photoSrc = path.join(PHOTOS_DIR, photoFilename);
          let actualPath = photoSrc;
          if (!fs.existsSync(photoSrc)) {
            const thumb = photoSrc.replace(/\.jpg$/, "_thumb.jpg");
            if (fs.existsSync(thumb)) actualPath = thumb;
          }
          if (fs.existsSync(actualPath)) {
            photoUrl = await uploadToBlob(
              actualPath,
              `victims/${Date.now()}-${photoFilename}`
            );
          }
        }

        await db
          .update(victims)
          .set({
            fullNameEn: fullNameEn ?? victim.fullNameEn,
            cityEn: cityEn ?? victim.cityEn,
            gender,
            source: source ?? victim.source,
            photoUrl: photoUrl ?? victim.photoUrl,
            updatedAt: new Date(),
          })
          .where(eq(victims.id, victim.id));

        updated++;
        if (updated % 100 === 0) console.log(`Updated ${updated}`);
      } else {
        let photoUrl: string | null = null;
        if (imagePath && hasPhotosDir) {
          const photoFilename = path.basename(imagePath);
          const photoSrc = path.join(PHOTOS_DIR, photoFilename);
          let actualPath = photoSrc;
          if (!fs.existsSync(photoSrc)) {
            const thumb = photoSrc.replace(/\.jpg$/, "_thumb.jpg");
            if (fs.existsSync(thumb)) actualPath = thumb;
          }
          if (fs.existsSync(actualPath)) {
            photoUrl = await uploadToBlob(
              actualPath,
              `victims/${Date.now()}-${photoFilename}`
            );
          } else {
            console.warn("Photo not found:", photoSrc);
          }
        } else if (imagePath && !hasPhotosDir) {
          console.warn("PHOTOS_DIR not found, skipping photo for:", fullNameFa);
        }

        await db.insert(victims).values({
          fullNameFa,
          fullNameEn,
          city,
          cityEn,
          dateOfDeath,
          gender,
          source,
          photoUrl,
        });

        inserted++;
        if (inserted % 50 === 0) console.log(`Inserted ${inserted}`);
      }
    } catch (e) {
      console.warn("Error row:", fullNameFa, e);
      errors++;
    }
  }

  console.log("\nDone.");
  console.log("Updated:", updated);
  console.log("Inserted:", inserted);
  console.log("Skipped:", skipped);
  console.log("Errors:", errors);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
