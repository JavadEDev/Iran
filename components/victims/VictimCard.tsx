"use client";

import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/utils/date";
import Image from "next/image";
import type { Victim } from "@/lib/types";

interface VictimCardProps {
  victim: Victim;
  onClick?: () => void;
}

export function VictimCard({ victim, onClick }: VictimCardProps) {
  const { language, isRTL } = useI18n();
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const name = language === "fa" ? victim.fullNameFa : victim.fullNameEn;
  const notes = language === "fa" ? victim.notesFa : victim.notesEn;
  const city = language === "fa" ? victim.city : victim.cityEn || victim.city;
  const rawSource = victim.source || "";
  const sources = rawSource
    ? rawSource
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const genderLabels = {
    fa: {
      male: "مرد",
      female: "زن",
      child: "کودک",
      unknown: "نامشخص",
    },
    en: {
      male: "Male",
      female: "Female",
      child: "Child",
      unknown: "Unknown",
    },
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
        onClick ? "cursor-pointer" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
      onClick={onClick}
    >
      {victim.photoUrl && (
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={victim.photoUrl}
            alt={
              name
                ? `${name} - ${language === "fa" ? "قربانی" : "Victim"}`
                : language === "fa"
                  ? "قربانی"
                  : "Victim"
            }
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{name || "Unknown"}</h3>
        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {victim.age !== null && (
            <p>
              {language === "fa" ? "سن" : "Age"}: {victim.age}
            </p>
          )}
          <p>
            {language === "fa" ? "جنسیت" : "Gender"}:{" "}
            {genderLabels[language][victim.gender]}
          </p>
          <p>
            {language === "fa" ? "شهر" : "City"}: {city}
          </p>
          <p>
            {language === "fa" ? "تاریخ فوت" : "Date of Death"}:{" "}
            {formatDate(victim.dateOfDeath, locale)}
          </p>
          {notes && (
            <p className="mt-2 text-gray-700 dark:text-gray-300 italic">
              {notes}
            </p>
          )}
          {sources.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                {language === "fa" ? "منابع مرتبط" : "Related sources"}
              </p>
              <ul className="space-y-1 text-xs">
                {sources.map((src, idx) => {
                  const href =
                    src.startsWith("http://") || src.startsWith("https://")
                      ? src
                      : `https://${src}`;
                  return (
                    <li key={idx}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                      >
                        {src}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
