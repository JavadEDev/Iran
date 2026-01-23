"use client";

import { useState, useTransition } from "react";
import { getVictims } from "@/lib/actions/victims";
import { VictimFilters } from "./VictimFilters";
import { VictimList } from "./VictimList";
import { useI18n } from "@/lib/i18n/context";
import type { VictimFilters as VictimFiltersType, VictimSortOptions, Victim, Language } from "@/lib/types";

interface VictimsPageClientProps {
  initialVictims: Victim[];
  lang: Language;
}

export function VictimsPageClient({ initialVictims, lang: initialLang }: VictimsPageClientProps) {
  const { language } = useI18n();
  const [victims, setVictims] = useState<Victim[]>(initialVictims);
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<VictimFiltersType>({});
  const [sort, setSort] = useState<VictimSortOptions>({ field: "dateOfDeath", direction: "desc" });

  const handleFiltersChange = (newFilters: VictimFiltersType) => {
    setFilters(newFilters);
    startTransition(async () => {
      const result = await getVictims(newFilters, sort, 1, 100);
      setVictims(result.items);
    });
  };

  const handleSortChange = (newSort: VictimSortOptions) => {
    setSort(newSort);
    startTransition(async () => {
      const result = await getVictims(filters, newSort, 1, 100);
      setVictims(result.items);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
      <VictimFilters
        onFiltersChange={handleFiltersChange}
        onSortChange={handleSortChange}
        currentFilters={filters}
        currentSort={sort}
      />
      {isPending ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading...</div>
      ) : (
        <VictimList victims={victims} />
      )}
    </div>
  );
}
