"use client";

import { useI18n } from "@/lib/i18n/context";
import { languages, languageNames } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

export function LanguageSwitcher({ variant = "default" }: { variant?: "default" | "header" }) {
  const { language, setLanguage } = useI18n();
  const isHeader = variant === "header";

  return (
    <div className="flex gap-2" role="group" aria-label="Language selector">
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium outline-none transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            isHeader
              ? "focus-visible:ring-green-500/80 focus-visible:ring-offset-slate-900"
              : "focus-visible:ring-gray-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900",
            isHeader
              ? language === lang
                ? "bg-green-500/25 text-green-400 ring-1 ring-green-500/40"
                : "text-slate-200 hover:bg-slate-800/80 hover:text-white"
              : language === lang
                ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          )}
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
