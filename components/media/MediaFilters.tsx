"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { MediaFilters, MediaSortOptions, MediaType } from "@/lib/types";

interface MediaFiltersProps {
  onFiltersChange: (filters: MediaFilters) => void;
  onSortChange: (sort: MediaSortOptions) => void;
  currentFilters: MediaFilters;
  currentSort: MediaSortOptions;
}

export function MediaFilters({
  onFiltersChange,
  onSortChange,
  currentFilters,
  currentSort,
}: MediaFiltersProps) {
  const { language, isRTL } = useI18n();
  const [filters, setFilters] = useState<MediaFilters>(currentFilters);
  const [sort, setSort] = useState<MediaSortOptions>(currentSort);

  const labels = {
    fa: {
      country: "کشور",
      city: "شهر",
      type: "نوع",
      dateRange: "محدوده تاریخ",
      sortBy: "مرتب‌سازی",
      apply: "اعمال",
      reset: "بازنشانی",
      all: "همه",
      photo: "عکس",
      video: "ویدیو",
      eventDate: "تاریخ رویداد",
      createdAt: "تاریخ ایجاد",
      location: "مکان",
      ascending: "صعودی",
      descending: "نزولی",
    },
    en: {
      country: "Country",
      city: "City",
      type: "Type",
      dateRange: "Date Range",
      sortBy: "Sort By",
      apply: "Apply",
      reset: "Reset",
      all: "All",
      photo: "Photo",
      video: "Video",
      eventDate: "Event Date",
      createdAt: "Created Date",
      location: "Location",
      ascending: "Ascending",
      descending: "Descending",
    },
  };

  const t = labels[language];

  const handleFilterChange = (key: keyof MediaFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(filters);
    onSortChange(sort);
  };

  const handleReset = () => {
    const emptyFilters: MediaFilters = {};
    const defaultSort: MediaSortOptions = { field: "createdAt", direction: "desc" };
    setFilters(emptyFilters);
    setSort(defaultSort);
    onFiltersChange(emptyFilters);
    onSortChange(defaultSort);
  };

  const inputBase =
    "w-full min-w-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700";

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
      dir={isRTL ? "rtl" : "ltr"}
      role="search"
      aria-label={t.country + ", " + t.city + ", " + t.type}
    >
      {/* Grid: 1 col mobile, 2 cols md, 7 cols xl so Date Range & Sort By get 2 cols each */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_minmax(200px,1.2fr)_minmax(200px,1.2fr)] gap-4 mb-4">
        <div className="min-w-0">
          <label className="block text-sm font-medium mb-2">{t.country}</label>
          <input
            type="text"
            value={filters.country || ""}
            onChange={(e) => handleFilterChange("country", e.target.value)}
            className={inputBase}
            placeholder={t.country}
          />
        </div>

        <div className="min-w-0">
          <label className="block text-sm font-medium mb-2">{t.city}</label>
          <input
            type="text"
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className={inputBase}
            placeholder={t.city}
          />
        </div>

        <div className="min-w-0">
          <label className="block text-sm font-medium mb-2">{t.type}</label>
          <select
            value={filters.mediaType || ""}
            onChange={(e) => handleFilterChange("mediaType", e.target.value || undefined)}
            className={inputBase}
          >
            <option value="">{t.all}</option>
            <option value="photo">{t.photo}</option>
            <option value="video">{t.video}</option>
          </select>
        </div>

        <div className="md:col-span-2 min-w-0">
          <label className="block text-sm font-medium mb-2">{t.dateRange}</label>
          <div className="flex gap-2 min-w-0">
            <input
              type="date"
              value={filters.dateFrom ? filters.dateFrom.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                handleFilterChange("dateFrom", e.target.value ? new Date(e.target.value) : undefined)
              }
              className={`flex-1 min-w-0 ${inputBase}`}
              aria-label={t.dateRange + " " + (language === "fa" ? "از" : "from")}
            />
            <input
              type="date"
              value={filters.dateTo ? filters.dateTo.toISOString().split("T")[0] : ""}
              onChange={(e) =>
                handleFilterChange("dateTo", e.target.value ? new Date(e.target.value) : undefined)
              }
              className={`flex-1 min-w-0 ${inputBase}`}
              aria-label={t.dateRange + " " + (language === "fa" ? "تا" : "to")}
            />
          </div>
        </div>

        <div className="md:col-span-2 min-w-0">
          <label className="block text-sm font-medium mb-2">{t.sortBy}</label>
          <div className="flex gap-2 min-w-0">
            <select
              value={sort.field}
              onChange={(e) => setSort({ ...sort, field: e.target.value as "eventDate" | "createdAt" | "location" })}
              className={`flex-1 min-w-0 ${inputBase}`}
              aria-label={t.sortBy + " " + (language === "fa" ? "فیلد" : "field")}
            >
              <option value="eventDate">{t.eventDate}</option>
              <option value="createdAt">{t.createdAt}</option>
              <option value="location">{t.location}</option>
            </select>
            <select
              value={sort.direction}
              onChange={(e) =>
                setSort({ ...sort, direction: e.target.value as "asc" | "desc" })
              }
              className={`flex-1 min-w-0 ${inputBase}`}
              aria-label={t.sortBy + " " + (language === "fa" ? "ترتیب" : "order")}
            >
              <option value="asc">{t.ascending}</option>
              <option value="desc">{t.descending}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t.apply}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
}
