/**
 * Import victims from Telegram chat export result.json.
 * Copies photos to public/victims and inserts records into the database.
 *
 * Usage:
 *   IMPORT_PATH="C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-28" npx tsx lib/db/import-victims-from-telegram.ts
 *
 * Or set IMPORT_PATH in .env.local
 */

import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load env before db (db requires DATABASE_URL)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const EXPORT_PATH =
  process.env.IMPORT_PATH ||
  process.env.TELEGRAM_EXPORT_PATH ||
  "C:\\Users\\Asus\\Downloads\\Telegram Desktop\\ChatExport_2026-01-28";

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

interface TelegramMessage {
  id?: number;
  type?: string;
  photo?: string;
  text?: string | (string | { type: string; text: string })[];
}

interface TelegramExport {
  messages?: TelegramMessage[];
}

function getFirstPlainText(msg: TelegramMessage): string {
  const t = msg.text;
  if (!t) return "";
  if (typeof t === "string") return t;
  const first = t[0];
  return typeof first === "string" ? first : "";
}

// Parse victim line: "۱. داریوش انصاری\n۱۰ دی ۱۴۰۴ فولادشهر اصفهان"
// Returns { fullNameFa, dateOfDeath (Gregorian YYYY-MM-DD), city } or null
function parseVictimText(raw: string): {
  fullNameFa: string;
  dateOfDeath: string;
  city: string;
} | null {
  const trimmed = raw.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;

  // Match: optional number + period, then name, then Persian date (day month year), then city
  // Persian date: digits + space + month name + space + digits (year)
  const monthPattern = Object.keys(PERSIAN_MONTHS).join("|");
  const dateRegex = new RegExp(
    `([۰-۹\\d]+)\\s+(${monthPattern})\\s+([۰-۹\\d]+)\\s*(.*)`,
    "u"
  );

  const lines = raw
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const singleLine = lines.join(" ");
  const match = singleLine.match(dateRegex);
  if (!match) return null;

  const [, dayStr, monthName, yearStr, cityPart] = match;
  const day = parseInt(persianDigitsToAscii(dayStr), 10);
  const month = PERSIAN_MONTHS[monthName];
  const year = parseInt(persianDigitsToAscii(yearStr), 10);
  const city = (cityPart || "").trim();
  if (!city || isNaN(day) || isNaN(year) || !month) return null;

  const [gy, gm, gd] = j2g(year, month, day);
  const dateOfDeath = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;

  // Name: from start until the date part (everything before "day month year")
  const dateStart = singleLine.indexOf(match[0]);
  let namePart = singleLine.slice(0, dateStart).trim();
  // Remove leading "N. " if present
  const nameMatch = namePart.match(/^[۰-۹\d]+\.\s*(.+)$/);
  const fullNameFa = nameMatch ? nameMatch[1].trim() : namePart;
  if (!fullNameFa) return null;

  return { fullNameFa, dateOfDeath, city };
}

async function main() {
  const { db } = await import("./index");
  const { victims } = await import("./schema");

  const resultPath = path.join(EXPORT_PATH, "result.json");
  const photosDir = path.join(EXPORT_PATH, "photos");
  const projectRoot = path.resolve(__dirname, "..", "..");
  const publicVictimsDir = path.join(projectRoot, "public", "victims");

  if (!fs.existsSync(resultPath)) {
    console.error("result.json not found at:", resultPath);
    process.exit(1);
  }
  if (!fs.existsSync(photosDir)) {
    console.error("photos folder not found at:", photosDir);
    process.exit(1);
  }

  if (!fs.existsSync(publicVictimsDir)) {
    fs.mkdirSync(publicVictimsDir, { recursive: true });
  }

  console.log("Reading", resultPath);
  const content = fs.readFileSync(resultPath, "utf-8");
  const data: TelegramExport = JSON.parse(content);
  const messages = data.messages || [];

  const withPhoto = messages.filter(
    (m): m is TelegramMessage & { photo: string } =>
      m.type === "message" && typeof m.photo === "string"
  );

  console.log(`Found ${withPhoto.length} messages with photos.`);

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < withPhoto.length; i++) {
    const msg = withPhoto[i];
    const text = getFirstPlainText(msg);
    const parsed = parseVictimText(text);

    if (!parsed) {
      skipped++;
      if (i < 5) console.warn("Skipped (unparseable):", text.slice(0, 80));
      continue;
    }

    const photoRel = msg.photo!;
    const photoSrc = path.join(EXPORT_PATH, photoRel);
    const photoBasename = path.basename(photoRel);

    if (!fs.existsSync(photoSrc)) {
      console.warn("Photo not found:", photoSrc);
      errors++;
      continue;
    }

    const photoDest = path.join(publicVictimsDir, photoBasename);
    try {
      fs.copyFileSync(photoSrc, photoDest);
    } catch (e) {
      console.warn("Copy failed:", photoSrc, e);
      errors++;
      continue;
    }

    const photoUrl = `/victims/${photoBasename}`;

    try {
      await db.insert(victims).values({
        fullNameFa: parsed.fullNameFa,
        fullNameEn: null,
        age: null,
        gender: "unknown",
        city: parsed.city,
        dateOfDeath: parsed.dateOfDeath,
        photoUrl,
        notesFa: null,
        notesEn: null,
        source: "Telegram: نام‌ها را به خاطر بسپار",
      });
      inserted++;
      if (inserted % 100 === 0) console.log("Inserted", inserted);
    } catch (e) {
      console.warn("Insert failed:", parsed.fullNameFa, e);
      errors++;
    }
  }

  console.log("\nDone.");
  console.log("Inserted:", inserted);
  console.log("Skipped (unparseable):", skipped);
  console.log("Errors:", errors);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
