import { getHomepageData } from "@/lib/actions/homepage";
import { getServerLanguage } from "@/lib/i18n/server";
import { RevolutionSection } from "@/components/homepage/RevolutionSection";
import { DictatorshipSection } from "@/components/homepage/DictatorshipSection";
import { VictimStatsSection } from "@/components/homepage/VictimStatsSection";
import { NewsSection } from "@/components/homepage/NewsSection";

export default async function HomePage() {
  const lang = await getServerLanguage();
  const data = await getHomepageData(lang);

  return (
    <>
      <RevolutionSection
        textFa={data.revolutionSection.textFa}
        textEn={data.revolutionSection.textEn}
        leaderImageUrl={data.revolutionSection.leaderImageUrl}
        leaderIntroFa={data.revolutionSection.leaderIntroFa}
        leaderIntroEn={data.revolutionSection.leaderIntroEn}
      />
      <DictatorshipSection
        textFa={data.dictatorshipSection.textFa}
        textEn={data.dictatorshipSection.textEn}
        images={data.dictatorshipSection.images}
      />
      <VictimStatsSection stats={data.victimStats} />
      <NewsSection featuredNews={data.featuredNews} recentNews={data.recentNews} />
    </>
  );
}
