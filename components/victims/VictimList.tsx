"use client";

import { VictimCard } from "./VictimCard";
import type { Victim } from "@/lib/types";

interface VictimListProps {
  victims: Victim[];
  onVictimClick?: (victim: Victim) => void;
}

export function VictimList({ victims, onVictimClick }: VictimListProps) {
  if (victims.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        No victims found matching the selected filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {victims.map((victim) => (
        <VictimCard
          key={victim.id}
          victim={victim}
          onClick={onVictimClick ? () => onVictimClick(victim) : undefined}
        />
      ))}
    </div>
  );
}
