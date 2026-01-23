import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <div className="flex gap-4 items-center">
              <Link href="/admin/victims" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Victims
              </Link>
              <Link href="/admin/news" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                News
              </Link>
              <Link href="/admin/statements" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Statements
              </Link>
              <Link href="/admin/media" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Media
              </Link>
              <Link href="/admin" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Dashboard
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
