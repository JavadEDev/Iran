import { PageTransition } from "@/components/PageTransition";

export default function Loading() {
  return (
    <PageTransition>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="h-9 w-64 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="h-10 w-40 rounded-md bg-blue-600/40 animate-pulse" />
        </div>

        <div className="mb-4 h-5 w-72 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />

        <div className="flex justify-center mb-6">
          <div className="w-full max-w-xl flex gap-2">
            <div className="flex-1 h-10 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-10 w-28 rounded-md bg-blue-600/40 animate-pulse" />
          </div>
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
              {Array.from({ length: 10 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <td className="px-4 py-3">
                    <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-16 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-10 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="h-9 w-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-5 w-36 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <div className="h-9 w-20 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse" />
          </div>
          <div className="flex flex-wrap justify-center gap-1 mt-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="min-w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
