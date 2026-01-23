"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import { formatDateForHeader } from "@/lib/utils/date";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { language, isRTL } = useI18n();
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const updateDate = () => {
      const locale = language === "fa" ? "fa-IR" : "en-US";
      setCurrentDate(formatDateForHeader(locale));
    };

    updateDate();
    const interval = setInterval(updateDate, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [language]);

  return (
    <header
      className="border-b border-gray-200 dark:border-gray-800"
      dir={isRTL ? "rtl" : "ltr"}
      role="banner"
      aria-label={language === "fa" ? "هدر سایت" : "Site header"}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/assets/flag.svg"
            alt={language === "fa" ? "پرچم ایران" : "Iranian Flag"}
            className="h-8 w-auto"
          />
          <h1 className="text-xl font-semibold">{language === "fa" ? "یادبود انقلاب ایران" : "Iranian Revolution Memorial"}</h1>
        </div>
        <div className="flex items-center gap-4">
          <time 
            dateTime={new Date().toISOString()} 
            className="text-sm text-gray-600 dark:text-gray-400"
            aria-label={language === "fa" ? "تاریخ امروز" : "Today's date"}
          >
            {currentDate}
          </time>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
