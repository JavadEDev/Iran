"use client";

import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/utils/date";
import Image from "next/image";
import type { NewsDetail } from "@/lib/types";

interface NewsDetailProps {
  news: NewsDetail;
}

export function NewsDetail({ news }: NewsDetailProps) {
  const { language, isRTL } = useI18n();
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const title = language === "fa" ? news.titleFa : news.titleEn;
  const content = news.fullContent;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <time dateTime={news.publicationDate.toISOString()}>
            {formatDate(news.publicationDate, locale)}
          </time>
          <span>
            {news.country}, {news.cities.join(", ")}
          </span>
        </div>
      </header>

      {news.media.image && (
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={news.media.image}
            alt={title || (language === "fa" ? "تصویر خبر" : "News image")}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
          />
        </div>
      )}

      {news.media.video && (
        <div className="mb-8">
          <video
            src={news.media.video}
            controls
            className="w-full rounded-lg"
            aria-label={title ? `${language === "fa" ? "ویدیو برای" : "Video for"} ${title}` : (language === "fa" ? "ویدیو خبر" : "News video")}
            preload="metadata"
          >
            {language === "fa" ? "مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند" : "Your browser does not support the video tag"}
          </video>
        </div>
      )}

      {news.media.audio && (
        <div className="mb-8">
          <audio
            src={news.media.audio}
            controls
            className="w-full"
            aria-label={title ? `${language === "fa" ? "صوت برای" : "Audio for"} ${title}` : (language === "fa" ? "صوت خبر" : "News audio")}
            preload="metadata"
          >
            {language === "fa" ? "مرورگر شما از تگ صوتی پشتیبانی نمی‌کند" : "Your browser does not support the audio tag"}
          </audio>
        </div>
      )}

      <div
        className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
