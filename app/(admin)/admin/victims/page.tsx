import { getVictims } from "@/lib/actions/victims";
import Link from "next/link";
import { formatDate } from "@/lib/utils/date";

export default async function VictimsManagementPage() {
  const { items } = await getVictims({}, { field: "createdAt", direction: "desc" }, 1, 50);

  return (
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
              <tr key={victim.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-4 py-3">{victim.fullNameEn || victim.fullNameFa || "Unknown"}</td>
                <td className="px-4 py-3">{victim.age || "-"}</td>
                <td className="px-4 py-3">{victim.gender}</td>
                <td className="px-4 py-3">{victim.city}</td>
                <td className="px-4 py-3">{formatDate(victim.dateOfDeath)}</td>
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
    </div>
  );
}
