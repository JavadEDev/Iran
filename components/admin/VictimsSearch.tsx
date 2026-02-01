"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function VictimsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();
    params.set("page", "1");

    if (value.trim()) {
      params.set("q", value.trim());
    }

    router.push(`?${params.toString()}`, {
      scroll: false,
    });
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-xl mx-auto mb-6">
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search by name, city, notes, source, gender, or age..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
}
