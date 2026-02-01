"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/utils/date";
import Image from "next/image";
import type { Victim } from "@/lib/types";

interface VictimModalProps {
  victim: Victim | null;
  onClose: () => void;
}

export function VictimModal({ victim, onClose }: VictimModalProps) {
  const { language, isRTL } = useI18n();
  const modalRef = useRef<HTMLDivElement>(null);
  const locale = language === "fa" ? "fa-IR" : "en-US";

  useEffect(() => {
    if (!victim) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [victim, onClose]);

  if (!victim) return null;

  const name = language === "fa" ? victim.fullNameFa : victim.fullNameEn;
  const notes = language === "fa" ? victim.notesFa : victim.notesEn;
  const city = language === "fa" ? victim.city : victim.cityEn || victim.city;

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        dir={isRTL ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
            aria-label={language === "fa" ? "بستن" : "Close"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Photo */}
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
                className="object-cover rounded-t-lg"
                sizes="(max-width: 768px) 100vw, 800px"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">{name || "Unknown"}</h2>
            <div className="space-y-3 text-lg">
              {victim.age !== null && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    {language === "fa" ? "سن" : "Age"}:
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {victim.age}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {language === "fa" ? "جنسیت" : "Gender"}:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {genderLabels[language][victim.gender]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {language === "fa" ? "شهر" : "City"}:
                </span>
                <span className="text-gray-600 dark:text-gray-400">{city}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {language === "fa" ? "تاریخ فوت" : "Date of Death"}:
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatDate(victim.dateOfDeath, locale)}
                </span>
              </div>
              {notes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 italic whitespace-pre-wrap">
                    {notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
