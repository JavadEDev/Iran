"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { NewsPreview } from "@/lib/types";
import { formatDateShort } from "@/lib/utils/date";

interface NewsSectionProps {
  featuredNews: NewsPreview | null;
  recentNews: NewsPreview[];
}

export function NewsSection({ featuredNews, recentNews }: NewsSectionProps) {
  const { language, isRTL } = useI18n();

  const labels = {
    title: language === "fa" ? "اخبار و بیانیه‌ها" : "News & Statements",
    readMore: language === "fa" ? "ادامه مطلب" : "Read More",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="py-16 px-4 bg-gray-50 dark:bg-gray-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold mb-8">{labels.title}</h2>

        {featuredNews && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <Link href={`/news/${encodeURIComponent(featuredNews.slug)}`} className="block group">
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                {featuredNews.thumbnailUrl ? (
                  <Image
                    src={featuredNews.thumbnailUrl}
                    alt={featuredNews.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority
                    sizes="(max-width: 768px) 100vw, 90vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <h3 className="absolute bottom-4 left-4 right-4 text-white text-2xl font-bold">
                  {featuredNews.title}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 line-clamp-2">{featuredNews.excerpt}</p>
            </Link>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentNews.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Link href={`/news/${encodeURIComponent(item.slug)}`} className="block group">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {item.thumbnailUrl && (
                    <div className="relative aspect-video">
                      <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {formatDateShort(item.publicationDate, language === "fa" ? "fa-IR" : "en-US")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {item.country}, {item.cities.join(", ")}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
