import { getNewsList } from "@/lib/actions/news";
import { getServerLanguage } from "@/lib/i18n/server";
import { NewsCard } from "@/components/news/NewsCard";

export default async function NewsPage() {
  const lang = await getServerLanguage();
  const { items } = await getNewsList(lang, 1, 20);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">News</h1>
      {items.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No news articles available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      )}
    </div>
  );
}
