"use client";

import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/utils/date";
import Image from "next/image";
import type { Statement } from "@/lib/actions/statements";

interface StatementDetailProps {
  statement: Statement;
}

export function StatementDetail({ statement }: StatementDetailProps) {
  const { language, isRTL } = useI18n();
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const title = language === "fa" ? statement.titleFa : statement.titleEn;
  const content = language === "fa" ? statement.contentFa : statement.contentEn;

  return (
    <article className="max-w-4xl mx-auto px-4 py-8" dir={isRTL ? "rtl" : "ltr"}>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <time
          dateTime={statement.publicationDate.toISOString()}
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {formatDate(statement.publicationDate, locale)}
        </time>
      </header>

      {statement.imageUrl && (
        <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
          <Image
            src={statement.imageUrl}
            alt={title || (language === "fa" ? "تصویر بیانیه" : "Statement image")}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 896px"
          />
        </div>
      )}

      <div
        className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content || "" }}
      />
    </article>
  );
}
