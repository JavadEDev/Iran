/**
 * Import victims from Excel file (telegram_data_structured.xlsx).
 * Uploads photos to Vercel Blob and inserts records into the database.
 *
 * Usage:
 *   EXCEL_PATH="C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-28\\telegram_data_structured.xlsx" PHOTOS_DIR="C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-28\\photos" npx tsx lib/db/import-victims-from-excel.ts
 *
 * Or set EXCEL_PATH and PHOTOS_DIR in .env.local
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import dotenv from "dotenv";
import { put } from "@vercel/blob";

// Load env before db (db requires DATABASE_URL)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const EXCEL_PATH =
  process.env.EXCEL_PATH ||
  process.env.TELEGRAM_EXCEL_PATH ||
  "C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-28\\telegram_data_structured.xlsx";

const PHOTOS_DIR =
  process.env.PHOTOS_DIR ||
  process.env.TELEGRAM_PHOTOS_DIR ||
  "C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-28\\photos";

// Persian (Jalali) month names to number
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

// Persian digits to ASCII
const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function persianDigitsToAscii(s: string): string {
  return s.replace(/[۰-۹]/g, (c) => String(PERSIAN_DIGITS.indexOf(c)));
}

// Jalali to Gregorian (j2g from jalali-convertor algorithm)
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

// Parse Persian date: "۱۰ دی ۱۴۰۴" -> "2024-12-31"
function parsePersianDate(dateStr: string): string | null {
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Match: day + space + month name + space + year
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

// Clean city name: remove @RememberTheirNames and extra spaces
function cleanCity(city: string): string {
  return city
    .replace(/@RememberTheirNames/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

// Upload file to Vercel Blob
async function uploadToBlob(
  filePath: string,
  blobPath: string
): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not set");
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
  fullNameFa: string;
  dateStr: string;
  city: string;
  photoPath: string;
}

async function main() {
  const { db } = await import("./index");
  const { victims } = await import("./schema");

  if (!fs.existsSync(EXCEL_PATH)) {
    console.error("Excel file not found at:", EXCEL_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error("Photos directory not found at:", PHOTOS_DIR);
    process.exit(1);
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("BLOB_READ_WRITE_TOKEN environment variable is not set");
    process.exit(1);
  }

  console.log("Reading Excel file:", EXCEL_PATH);
  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet, {
    header: ["fullNameFa", "dateStr", "city", "photoPath"],
    range: 1, // Skip header row
  }) as ExcelRow[];

  console.log(`Found ${rows.length} rows in Excel.`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row.fullNameFa || !row.dateStr || !row.city || !row.photoPath) {
      skipped++;
      if (i < 5) console.warn("Skipped (missing data):", row);
      continue;
    }

    const dateOfDeath = parsePersianDate(row.dateStr);
    if (!dateOfDeath) {
      skipped++;
      if (i < 5) console.warn("Skipped (invalid date):", row.dateStr);
      continue;
    }

    const city = cleanCity(row.city);
    if (!city) {
      skipped++;
      if (i < 5) console.warn("Skipped (empty city):", row.city);
      continue;
    }

    // Extract photo filename from path (e.g., "photos/photo_1@18-01-2026_19-38-12.jpg" -> "photo_1@18-01-2026_19-38-12.jpg")
    const photoFilename = path.basename(row.photoPath);
    const photoSrc = path.join(PHOTOS_DIR, photoFilename);

    // Check for thumb version if main photo doesn't exist
    let actualPhotoPath = photoSrc;
    if (!fs.existsSync(photoSrc)) {
      const thumbPath = photoSrc.replace(/\.jpg$/, "_thumb.jpg");
      if (fs.existsSync(thumbPath)) {
        actualPhotoPath = thumbPath;
      } else {
        console.warn("Photo not found:", photoSrc);
        errors++;
        continue;
      }
    }

    try {
      // Upload to Vercel Blob
      const blobPath = `victims/${Date.now()}-${photoFilename}`;
      const photoUrl = await uploadToBlob(actualPhotoPath, blobPath);
      console.log(`Uploaded: ${photoFilename} -> ${photoUrl}`);

      // Insert into database
      await db.insert(victims).values({
        fullNameFa: row.fullNameFa.trim(),
        fullNameEn: null,
        age: null,
        gender: "unknown",
        city: city,
        dateOfDeath: dateOfDeath,
        photoUrl: photoUrl,
        notesFa: null,
        notesEn: null,
        source: "Telegram: نام‌ها را به خاطر بسپار (Excel Import)",
      });

      inserted++;
      if (inserted % 50 === 0) {
        console.log(`Progress: Inserted ${inserted}/${rows.length}`);
      }
    } catch (e) {
      console.warn("Error processing row:", row.fullNameFa, e);
      errors++;
    }
  }

  console.log("\nDone.");
  console.log("Inserted:", inserted);
  console.log("Skipped:", skipped);
  console.log("Errors:", errors);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
