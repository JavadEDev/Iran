import { getNewsList } from "@/lib/actions/news";
import { getServerLanguage } from "@/lib/i18n/server";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils/date";

export default async function NewsManagementPage() {
  const lang = await getServerLanguage();
  const { items } = await getNewsList(lang, 1, 50);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">News Management</h1>
        <Link
          href="/admin/news/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New News
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Cities</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((news) => (
              <tr key={news.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3">{news.title}</td>
                <td className="px-4 py-3">{formatDateShort(news.publicationDate, lang === "fa" ? "fa-IR" : "en-US")}</td>
                <td className="px-4 py-3">{news.country}</td>
                <td className="px-4 py-3">{news.cities.join(", ")}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/news/${encodeURIComponent(news.slug)}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
