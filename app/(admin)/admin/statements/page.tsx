import { getStatementsList } from "@/lib/actions/statements";
import { getServerLanguage } from "@/lib/i18n/server";
import Link from "next/link";
import { formatDateShort } from "@/lib/utils/date";

export default async function StatementsManagementPage() {
  const lang = await getServerLanguage();
  const statements = await getStatementsList(lang);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Statements Management</h1>
        <Link
          href="/admin/statements/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Statement
        </Link>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {statements.map((stmt) => (
              <tr key={stmt.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3">{stmt.title}</td>
                <td className="px-4 py-3">{formatDateShort(stmt.publicationDate, lang === "fa" ? "fa-IR" : "en-US")}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/statements/${stmt.slug}`}
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
