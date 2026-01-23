import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/victims"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Victims</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage victim entries</p>
        </Link>
        <Link
          href="/admin/news"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">News</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage news articles</p>
        </Link>
        <Link
          href="/admin/statements"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Statements</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage official statements</p>
        </Link>
        <Link
          href="/admin/media"
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Media</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage photos and videos</p>
        </Link>
      </div>
    </div>
  );
}
