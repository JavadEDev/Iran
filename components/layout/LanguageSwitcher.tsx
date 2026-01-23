"use client";

import { useI18n } from "@/lib/i18n/context";
import { languages, languageNames } from "@/lib/i18n/config";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex gap-2" role="group" aria-label="Language selector">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-3 py-1 rounded transition-colors ${
            language === lang
              ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          }`}
          aria-label={`Switch to ${languageNames[lang]}`}
          aria-pressed={language === lang}
          type="button"
        >
          {languageNames[lang]}
        </button>
      ))}
    </div>
  );
}
