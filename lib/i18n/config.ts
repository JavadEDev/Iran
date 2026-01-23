export type Language = "fa" | "en";

export const languages: Language[] = ["fa", "en"];

export const defaultLanguage: Language = "en";

export const languageNames: Record<Language, string> = {
  fa: "فارسی",
  en: "English",
};

export const rtlLanguages: Language[] = ["fa"];

export function isRTL(lang: Language): boolean {
  return rtlLanguages.includes(lang);
}
