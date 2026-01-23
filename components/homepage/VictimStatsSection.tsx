"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import type { VictimStats } from "@/lib/types";

interface VictimStatsSectionProps {
  stats: VictimStats;
}

export function VictimStatsSection({ stats }: VictimStatsSectionProps) {
  const { language, isRTL } = useI18n();

  const labels = {
    total: language === "fa" ? "کل قربانیان" : "Total Victims",
    male: language === "fa" ? "مرد" : "Men",
    female: language === "fa" ? "زن" : "Women",
    child: language === "fa" ? "کودک" : "Children",
    unknown: language === "fa" ? "نامشخص" : "Unknown",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="py-16 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {language === "fa" ? "آمار قربانیان" : "Victim Statistics"}
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8" role="group" aria-label={labels.total}>
            <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2" aria-live="polite" aria-atomic="true">
              {stats.total.toLocaleString()}
            </div>
            <div className="text-xl text-gray-600 dark:text-gray-400">{labels.total}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" role="group" aria-label={language === "fa" ? "آمار بر اساس جنسیت" : "Statistics by Gender"}>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded" role="group" aria-label={labels.male}>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white" aria-live="polite" aria-atomic="true">
                {stats.byGender.male.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{labels.male}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded" role="group" aria-label={labels.female}>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white" aria-live="polite" aria-atomic="true">
                {stats.byGender.female.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{labels.female}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded" role="group" aria-label={labels.child}>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white" aria-live="polite" aria-atomic="true">
                {stats.byGender.child.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{labels.child}</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded" role="group" aria-label={labels.unknown}>
              <div className="text-2xl font-semibold text-gray-900 dark:text-white" aria-live="polite" aria-atomic="true">
                {stats.byGender.unknown.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{labels.unknown}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
