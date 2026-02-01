import { getNewsBySlug } from "@/lib/actions/news";
import { getServerLanguage } from "@/lib/i18n/server";
import { notFound } from "next/navigation";
import { NewsEditForm } from "@/components/admin/NewsEditForm";

export default async function NewsEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolved = await params;
  let slug = (resolved.slug ?? "").replace(/\/+$/, "").trim();
  try {
    slug = decodeURIComponent(slug);
  } catch {
    /* use as-is if not valid percent-encoding */
  }
  if (!slug) {
    notFound();
  }
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
