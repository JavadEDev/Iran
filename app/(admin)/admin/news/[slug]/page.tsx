import { getNewsBySlug } from "@/lib/actions/news";
import { getServerLanguage } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import { NewsEditForm } from "@/components/admin/NewsEditForm";

export default async function NewsEditPage({
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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit News</h1>
      <NewsEditForm news={news} />
    </div>
  );
}
