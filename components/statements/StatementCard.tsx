"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils/date";
import { useI18n } from "@/lib/i18n/context";
import type { StatementPreview } from "@/lib/actions/statements";

interface StatementCardProps {
  statement: StatementPreview;
}

export function StatementCard({ statement }: StatementCardProps) {
  const { language, isRTL } = useI18n();
  const locale = language === "fa" ? "fa-IR" : "en-US";

  return (
    <Link
      href={`/statements/${statement.slug}`}
      className={`block group rounded-lg overflow-hidden transition-all ${
        statement.isLatest
          ? "bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 shadow-lg"
          : "bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {statement.imageUrl && (
        <div className="relative aspect-video">
          <Image
            src={statement.imageUrl}
            alt={statement.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
        </div>
      )}
      <div className="p-4">
        <h3
          className={`font-semibold mb-2 ${
            statement.isLatest ? "text-blue-900 dark:text-blue-100" : "text-gray-900 dark:text-white"
          }`}
        >
          {statement.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatDateShort(statement.publicationDate, locale)}
        </p>
        {statement.isLatest && (
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded">
            {language === "fa" ? "آخرین بیانیه" : "Latest Statement"}
          </span>
        )}
      </div>
    </Link>
  );
}
