"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/context";
import { formatDate } from "@/lib/utils/date";
import type { MediaItem } from "@/lib/types";

interface MediaModalProps {
  media: MediaItem;
  onClose: () => void;
}

export function MediaModal({ media, onClose }: MediaModalProps) {
  const { language, isRTL } = useI18n();
  const locale = language === "fa" ? "fa-IR" : "en-US";
  const description = language === "fa" ? media.descriptionFa : media.descriptionEn;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-6xl max-h-[90vh] w-full"
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? "rtl" : "ltr"}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            {media.mediaType === "photo" ? (
              <div className="relative aspect-video max-h-[70vh]">
                <Image
                  src={media.fileUrl}
                  alt={description || (language === "fa" ? "رسانه" : "Media")}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
            ) : (
              <div className="relative aspect-video">
                <video
                  src={media.fileUrl}
                  controls
                  className="w-full h-full"
                  autoPlay
                  aria-label={description || (language === "fa" ? "ویدیو" : "Video")}
                  preload="metadata"
                >
                  {language === "fa" ? "مرورگر شما از تگ ویدیو پشتیبانی نمی‌کند" : "Your browser does not support the video tag"}
                </video>
              </div>
            )}

            <div className="p-6">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span>
                  {language === "fa" ? "کشور" : "Country"}: {media.country}
                </span>
                <span>
                  {language === "fa" ? "شهر" : "City"}: {media.city}
                </span>
                {media.district && (
                  <span>
                    {language === "fa" ? "محله" : "District"}: {media.district}
                  </span>
                )}
                {media.eventDate && (
                  <span>
                    {language === "fa" ? "تاریخ رویداد" : "Event Date"}:{" "}
                    {formatDate(media.eventDate, locale)}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed">{description}</p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
