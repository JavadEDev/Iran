import { getVictims } from "@/lib/actions/victims";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date";
import { AdminVictimsPagination } from "@/components/admin/AdminVictimsPagination";
import { PageTransition } from "@/components/PageTransition";
import { VictimsSearch } from "@/components/admin/VictimsSearch";

const PAGE_SIZE = 20;

function parsePage(value: string | undefined): number {
  if (!value) return 1;
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export const dynamic = "force-dynamic";

export default async function VictimsManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;

  const requestedPage = parsePage(params.page);
  const search = typeof params.q === "string" ? params.q.trim() : "";

  const first = await getVictims(
    search ? { search } : {},
    { field: "createdAt", direction: "desc" },
    requestedPage,
    PAGE_SIZE
  );

  const totalPages = Math.max(1, Math.ceil(first.total / first.pageSize));

  const currentPage = Math.min(requestedPage, totalPages);

  const { items, total, pageSize } =
    currentPage !== requestedPage
      ? await getVictims(
          search ? { search } : {},
          { field: "createdAt", direction: "desc" },
          currentPage,
          PAGE_SIZE
        )
      : first;

  const start = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Victims Management</h1>
          <Link
            href="/admin/victims/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Victim
          </Link>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {start}–{end} of {total} victims • Page {currentPage} of{" "}
          {totalPages}
        </div>
        <div className="flex justify-center mb-6">
          <VictimsSearch />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Date of Death</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((victim) => (
                <tr
                  key={victim.id}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-3">
                    {victim.fullNameEn || victim.fullNameFa || "Unknown"}
                  </td>
                  <td className="px-4 py-3">{victim.age ?? "-"}</td>
                  <td className="px-4 py-3">{victim.gender ?? "-"}</td>
                  <td className="px-4 py-3">{victim.city ?? "-"}</td>
                  <td className="px-4 py-3">
                    {formatDate(victim.dateOfDeath)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/victims/${victim.id}`}
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

        {totalPages > 1 && (
          <AdminVictimsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            search={search}
          />
        )}
      </div>
    </PageTransition>
  );
}
