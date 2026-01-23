import { getNewsBySlug } from "@/lib/actions/news";
import { getServerLanguage } from "@/lib/i18n/server";
import { NewsDetail } from "@/components/news/NewsDetail";
import { notFound } from "next/navigation";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lang = await getServerLanguage();
  const news = await getNewsBySlug(slug, lang);

  if (!news) {
    notFound();
  }

  return <NewsDetail news={news} />;
}
