import Link from "next/link";
import { adminConfig } from "@/lib/config/admin";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{adminConfig.dashboardTitle}</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {adminConfig.dashboardCards.map(({ href, title, description }) => (
          <Link
            key={href}
            href={href}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
