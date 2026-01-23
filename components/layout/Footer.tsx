"use client";

import { useI18n } from "@/lib/i18n/context";

export function Footer() {
  const { isRTL } = useI18n();

  return (
    <footer
      className="border-t border-gray-200 dark:border-gray-800 mt-auto py-8"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Iranian Revolution Memorial</p>
        <p className="mt-2">Documenting history with dignity and respect</p>
      </div>
    </footer>
  );
}
