"use client";

import { useState, useTransition } from "react";
import { getVictims } from "@/lib/actions/victims";
import { VictimFilters } from "./VictimFilters";
import { VictimList } from "./VictimList";
import { VictimModal } from "./VictimModal";
import { BackgroundMusicPlayer } from "./BackgroundMusicPlayer";
import { VictimsPagination } from "./VictimsPagination";
import { useI18n } from "@/lib/i18n/context";
import type {
  VictimFilters as VictimFiltersType,
  VictimSortOptions,
  Victim,
  Language,
} from "@/lib/types";

const PAGE_SIZE = 20;

interface VictimsPageClientProps {
  initialVictims: Victim[];
  initialTotal: number;
  initialPageSize: number;
  lang: Language;
}

export function VictimsPageClient({
  initialVictims,
  initialTotal,
  initialPageSize,
  lang: initialLang,
}: VictimsPageClientProps) {
  const { language } = useI18n();
  const [victims, setVictims] = useState<Victim[]>(initialVictims);
  const [total, setTotal] = useState(initialTotal);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<VictimFiltersType>({});
  const [sort, setSort] = useState<VictimSortOptions>({
    field: "dateOfDeath",
    direction: "desc",
  });
  const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null);

  const handleFiltersChange = (newFilters: VictimFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
    startTransition(async () => {
      const result = await getVictims(newFilters, sort, 1, PAGE_SIZE);
      setVictims(result.items);
      setTotal(result.total);
      setPageSize(result.pageSize);
    });
  };

  const handleSortChange = (newSort: VictimSortOptions) => {
    setSort(newSort);
    setCurrentPage(1);
    startTransition(async () => {
      const result = await getVictims(filters, newSort, 1, PAGE_SIZE);
      setVictims(result.items);
      setTotal(result.total);
      setPageSize(result.pageSize);
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    startTransition(async () => {
      const result = await getVictims(filters, sort, page, PAGE_SIZE);
      setVictims(result.items);
      setTotal(result.total);
      setPageSize(result.pageSize);
    });
  };

  const labels = {
    fa: {
      title: "قربانیان",
    },
    en: {
      title: "Victims",
    },
  };

  const t = labels[language];

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
        <VictimFilters
          onFiltersChange={handleFiltersChange}
          onSortChange={handleSortChange}
          currentFilters={filters}
          currentSort={sort}
        />
        {isPending ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">
            Loading...
          </div>
        ) : (
          <VictimList victims={victims} onVictimClick={setSelectedVictim} />
        )}
        {Math.max(1, Math.ceil(total / pageSize)) > 1 && (
          <VictimsPagination
            currentPage={currentPage}
            totalPages={Math.max(1, Math.ceil(total / pageSize))}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <VictimModal
        victim={selectedVictim}
        onClose={() => setSelectedVictim(null)}
      />
      <BackgroundMusicPlayer />
    </>
  );
}
