"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import Image from "next/image";

interface DictatorshipSectionProps {
  textFa: string;
  textEn: string;
  images: string[];
}

export function DictatorshipSection({ textFa, textEn, images }: DictatorshipSectionProps) {
  const { language, isRTL } = useI18n();
  const text = language === "fa" ? textFa : textEn;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="py-16 px-4 bg-gray-50 dark:bg-gray-900"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-3xl font-bold mb-6">{text}</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{text}</p>
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-video">
                  <Image
                    src={img}
                    alt={`${text} - Image ${idx + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
