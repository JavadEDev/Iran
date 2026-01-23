import { cookies } from "next/headers";
import type { Language } from "./config";
import { defaultLanguage } from "./config";

export async function getServerLanguage(): Promise<Language> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("language");
  return (langCookie?.value as Language) || defaultLanguage;
}

export function getLocalizedText<T>(
  text: { fa: T | null; en: T | null },
  lang: Language
): T | null {
  return text[lang] ?? text[defaultLanguage] ?? null;
}
