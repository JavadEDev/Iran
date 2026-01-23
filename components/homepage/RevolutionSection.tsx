"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import Image from "next/image";

interface RevolutionSectionProps {
  textFa: string;
  textEn: string;
  leaderImageUrl: string;
  leaderIntroFa: string;
  leaderIntroEn: string;
}

export function RevolutionSection({
  textFa,
  textEn,
  leaderImageUrl,
  leaderIntroFa,
  leaderIntroEn,
}: RevolutionSectionProps) {
  const { language, isRTL } = useI18n();
  const text = language === "fa" ? textFa : textEn;
  const intro = language === "fa" ? leaderIntroFa : leaderIntroEn;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 px-4"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto max-w-4xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">{text}</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{intro}</p>
          </div>
          <div className="relative aspect-video">
            <Image
              src={leaderImageUrl}
              alt={language === "fa" ? "رهبر ایران" : "Leader of Iran"}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
