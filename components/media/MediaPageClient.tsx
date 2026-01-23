"use client";

import { useState, useTransition } from "react";
import { getMediaList } from "@/lib/actions/media";
import { MediaFilters } from "./MediaFilters";
import { MediaGrid } from "./MediaGrid";
import { useI18n } from "@/lib/i18n/context";
import type { MediaFilters as MediaFiltersType, MediaSortOptions, MediaItem, Language } from "@/lib/types";

interface MediaPageClientProps {
  initialMedia: MediaItem[];
  lang: Language;
}

export function MediaPageClient({ initialMedia, lang: initialLang }: MediaPageClientProps) {
  const { language } = useI18n();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initialMedia);
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<MediaFiltersType>({});
  const [sort, setSort] = useState<MediaSortOptions>({ field: "createdAt", direction: "desc" });

  const handleFiltersChange = (newFilters: MediaFiltersType) => {
    setFilters(newFilters);
    startTransition(async () => {
      const result = await getMediaList(newFilters, sort, 1, 50);
      setMediaItems(result.items);
    });
  };

  const handleSortChange = (newSort: MediaSortOptions) => {
    setSort(newSort);
    startTransition(async () => {
      const result = await getMediaList(filters, newSort, 1, 50);
      setMediaItems(result.items);
    });
  };

  const labels = {
    fa: {
      title: "گالری رسانه",
    },
    en: {
      title: "Media Gallery",
    },
  };

  const t = labels[language];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
      <MediaFilters
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        currentFilters={filters}
        currentSort={sort}
      />
      {isPending ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>
      ) : (
        <MediaGrid items={mediaItems} />
      )}
    </div>
  );
}
