"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { VictimFilters, VictimSortOptions, Gender } from "@/lib/types";

interface VictimFiltersProps {
  onFiltersChange: (filters: VictimFilters) => void;
  onSortChange: (sort: VictimSortOptions) => void;
  currentFilters: VictimFilters;
  currentSort: VictimSortOptions;
}

export function VictimFilters({
  onFiltersChange,
  onSortChange,
  currentFilters,
  currentSort,
}: VictimFiltersProps) {
  const { language, isRTL } = useI18n();
  const [filters, setFilters] = useState<VictimFilters>(currentFilters);
  const [sort, setSort] = useState<VictimSortOptions>(currentSort);

  const labels = {
    fa: {
      city: "شهر",
      gender: "جنسیت",
      ageRange: "محدوده سنی",
      dateRange: "محدوده تاریخ",
      sortBy: "مرتب‌سازی بر اساس",
      apply: "اعمال",
      reset: "بازنشانی",
      all: "همه",
      male: "مرد",
      female: "زن",
      child: "کودک",
      unknown: "نامشخص",
      dateOfDeath: "تاریخ فوت",
      createdAt: "تاریخ ایجاد",
      name: "نام",
      ascending: "صعودی",
      descending: "نزولی",
    },
    en: {
      city: "City",
      gender: "Gender",
      ageRange: "Age Range",
      dateRange: "Date Range",
      sortBy: "Sort By",
      apply: "Apply",
      reset: "Reset",
      all: "All",
      male: "Male",
      female: "Female",
      child: "Child",
      unknown: "Unknown",
      dateOfDeath: "Date of Death",
      createdAt: "Created Date",
      name: "Name",
      ascending: "Ascending",
      descending: "Descending",
    },
  };

  const t = labels[language];

  const handleFilterChange = (key: keyof VictimFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(filters);
    onSortChange(sort);
  };

  const handleReset = () => {
    const emptyFilters: VictimFilters = {};
    const defaultSort: VictimSortOptions = { field: "dateOfDeath", direction: "desc" };
    setFilters(emptyFilters);
    setSort(defaultSort);
    onFiltersChange(emptyFilters);
    onSortChange(defaultSort);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
      dir={isRTL ? "rtl" : "ltr"}
      role="search"
      aria-label={t.city + ", " + t.gender + ", " + t.ageRange}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t.city}</label>
          <input
            type="text"
            value={filters.city || ""}
            onChange={(e) => handleFilterChange("city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            placeholder={t.city}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t.gender}</label>
          <select
            value={filters.gender || ""}
            onChange={(e) => handleFilterChange("gender", e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="">{t.all}</option>
            <option value="male">{t.male}</option>
            <option value="female">{t.female}</option>
            <option value="child">{t.child}</option>
            <option value="unknown">{t.unknown}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t.ageRange}</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={filters.minAge || ""}
              onChange={(e) => handleFilterChange("minAge", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Min"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
            <input
              type="number"
              value={filters.maxAge || ""}
              onChange={(e) => handleFilterChange("maxAge", e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Max"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">{t.sortBy}</label>
          <div className="flex gap-2">
            <select
              value={sort.field}
              onChange={(e) => setSort({ ...sort, field: e.target.value as any })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="dateOfDeath">{t.dateOfDeath}</option>
              <option value="createdAt">{t.createdAt}</option>
              <option value="name">{t.name}</option>
            </select>
            <select
              value={sort.direction}
              onChange={(e) => setSort({ ...sort, direction: e.target.value as any })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            >
              <option value="asc">{t.ascending}</option>
              <option value="desc">{t.descending}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          type="button"
          aria-label={t.apply}
        >
          {t.apply}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          type="button"
          aria-label={t.reset}
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
}
