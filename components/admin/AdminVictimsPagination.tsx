"use client";

import { useRouter } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
  search: string;
};

export function AdminVictimsPagination({
  currentPage,
  totalPages,
  search,
}: Props) {
  const router = useRouter();

  const maxVisible = 9;
  let pages: (number | "ellipsis")[] = [];

  const safeCurrent = Math.min(Math.max(1, Number(currentPage)), totalPages);
  const trimmedSearch = search?.trim();

  const buildQuery = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    if (trimmedSearch) params.set("q", trimmedSearch);
    return `?${params.toString()}`;
  };

  if (totalPages <= maxVisible) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const half = Math.floor(maxVisible / 2);
    let startP = Math.max(1, safeCurrent - half);
    let endP = Math.min(totalPages, startP + maxVisible - 1);

    if (endP - startP + 1 < maxVisible) {
      startP = Math.max(1, endP - maxVisible + 1);
    }

    if (startP > 1) {
      pages.push(1);
      if (startP > 2) pages.push("ellipsis");
    }

    for (let p = startP; p <= endP; p++) {
      pages.push(p);
    }

    if (endP < totalPages) {
      if (endP < totalPages - 1) pages.push("ellipsis");
      pages.push(totalPages);
    }
  }

  return (
    <nav
      className="mt-6 flex flex-col items-center gap-2"
      aria-label="Victims pagination"
    >
      {/* Previous / Next */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <button
          type="button"
          disabled={safeCurrent <= 1}
          aria-disabled={safeCurrent <= 1}
          onClick={() =>
            router.push(buildQuery(safeCurrent - 1), { scroll: false })
          }
          className={`px-3 py-2 rounded-md text-sm ${
            safeCurrent <= 1
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
          }`}
        >
          Previous
        </button>
        <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
          Page <span className="font-bold text-md">{safeCurrent}</span> of{" "}
          <span className="font-bold text-md">{totalPages}</span>
        </span>

        <button
          type="button"
          disabled={safeCurrent >= totalPages}
          aria-disabled={safeCurrent >= totalPages}
          onClick={() =>
            router.push(buildQuery(safeCurrent + 1), { scroll: false })
          }
          className={`px-3 py-2 rounded-md text-sm ${
            safeCurrent >= totalPages
              ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>

      {/* Page numbers */}
      <div className="flex flex-wrap justify-center gap-1 mt-1">
        {pages.map((p, index) =>
          p === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 py-1.5 text-gray-500"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => router.push(buildQuery(p), { scroll: false })}
              aria-current={p === safeCurrent ? "page" : undefined}
              className={`min-w-8 px-2 py-1.5 rounded text-sm text-center cursor-pointer ${
                p === safeCurrent
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {p}
            </button>
          )
        )}
      </div>
    </nav>
  );
}
