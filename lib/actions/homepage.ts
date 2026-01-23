"use server";

import { getVictimStats } from "./victims";
import { getFeaturedNews, getRecentNews } from "./news";
import type { Language } from "@/lib/i18n/config";
import type { HomepageData } from "@/lib/types";

export async function getHomepageData(lang: Language): Promise<HomepageData> {
  const [victimStats, featuredNews, recentNews] = await Promise.all([
    getVictimStats(),
    getFeaturedNews(lang),
    getRecentNews(lang, 5),
  ]);

  return {
    revolutionSection: {
      textFa: "انقلاب ایران",
      textEn: "Iranian Revolution",
      leaderImageUrl: "/assets/flag.svg", // Placeholder
      leaderIntroFa: "مقدمه رهبر",
      leaderIntroEn: "Leader Introduction",
    },
    dictatorshipSection: {
      textFa: "جمهوری اسلامی و دیکتاتوری",
      textEn: "Islamic Republic and Dictatorship",
      images: [],
    },
    victimStats,
    featuredNews,
    recentNews,
  };
}
