"use client";

import type { Language } from "./config";
import { defaultLanguage } from "./config";

const LANGUAGE_STORAGE_KEY = "ir-rev-language";

export function getStoredLanguage(): Language {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "fa" || stored === "en") {
      return stored;
    }
  } catch (error) {
    console.error("Failed to read language from localStorage:", error);
  }

  return defaultLanguage;
}

export function setStoredLanguage(lang: Language): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    // Also set cookie for server-side access
    document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
  } catch (error) {
    console.error("Failed to save language to localStorage:", error);
  }
}
