"use client";

import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/utils/date";
import Image from "next/image";
import type { Victim } from "@/lib/types";

interface VictimCardProps {
  victim: Victim;
}

export function VictimCard({ victim }: VictimCardProps) {
  const { language, isRTL } = useI18n();
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const name = language === "fa" ? victim.fullNameFa : victim.fullNameEn;
  const notes = language === "fa" ? victim.notesFa : victim.notesEn;

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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {victim.photoUrl && (
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={victim.photoUrl}
            alt={name ? `${name} - ${language === "fa" ? "قربانی" : "Victim"}` : language === "fa" ? "قربانی" : "Victim"}
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
            {language === "fa" ? "جنسیت" : "Gender"}: {genderLabels[language][victim.gender]}
          </p>
          <p>
            {language === "fa" ? "شهر" : "City"}: {victim.city}
          </p>
          <p>
            {language === "fa" ? "تاریخ فوت" : "Date of Death"}:{" "}
            {formatDate(victim.dateOfDeath, locale)}
          </p>
          {notes && (
            <p className="mt-2 text-gray-700 dark:text-gray-300 italic">{notes}</p>
          )}
        </div>
      </div>
    </div>
  );
}
