"use client";

import { useState } from "react";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import type { MediaItem } from "@/lib/types";
import { MediaModal } from "./MediaModal";

interface MediaGridProps {
  items: MediaItem[];
}

export function MediaGrid({ items }: MediaGridProps) {
  const { language, isRTL } = useI18n();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-600 dark:text-gray-400">
        {language === "fa" ? "هیچ رسانه‌ای یافت نشد" : "No media found"}
      </div>
    );
  }

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedMedia(item)}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
          >
            {item.mediaType === "photo" ? (
              <Image
                src={item.fileUrl}
                alt={item.descriptionFa || item.descriptionEn || (language === "fa" ? "رسانه" : "Media")}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                loading="lazy"
              />
            ) : (
              <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.descriptionFa || item.descriptionEn || "Video"}
                    fill
                    className="object-cover opacity-50"
                  />
                ) : null}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <p className="text-white text-sm line-clamp-1">
                {language === "fa" ? item.descriptionFa : item.descriptionEn || ""}
              </p>
            </div>
          </div>
        ))}
      </div>
      {selectedMedia && (
        <MediaModal media={selectedMedia} onClose={() => setSelectedMedia(null)} />
      )}
    </>
  );
}
