import { getMediaList } from "@/lib/actions/media";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils/date";
import { getServerLanguage } from "@/lib/i18n/server";

export default async function MediaManagementPage() {
  const lang = await getServerLanguage();
  const { items } = await getMediaList({}, { field: "createdAt", direction: "desc" }, 1, 50);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Media Management</h1>
        <Link
          href="/admin/media/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Media
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">City</th>
              <th className="px-4 py-3 text-left">Event Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((media) => (
              <tr key={media.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3">{media.mediaType}</td>
                <td className="px-4 py-3">{media.country}</td>
                <td className="px-4 py-3">{media.city}</td>
                <td className="px-4 py-3">
                  {media.eventDate ? formatDateShort(media.eventDate, lang === "fa" ? "fa-IR" : "en-US") : "-"}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/media/${media.id}`}
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
