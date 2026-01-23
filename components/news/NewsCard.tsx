"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDateShort } from "@/lib/utils/date";
import type { NewsPreview } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

interface NewsCardProps {
  news: NewsPreview;
}

export function NewsCard({ news }: NewsCardProps) {
  const { language, isRTL } = useI18n();
  const locale = language === "fa" ? "fa-IR" : "en-US";

  return (
    <Link
      href={`/news/${news.slug}`}
      className="block group bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {news.thumbnailUrl && (
        <div className="relative aspect-video">
          <Image
            src={news.thumbnailUrl}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {news.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {formatDateShort(news.publicationDate, locale)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {news.country}, {news.cities.join(", ")}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{news.excerpt}</p>
      </div>
    </Link>
  );
}
