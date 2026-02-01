import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { adminConfig } from "@/lib/config/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const isLoginPage = headersList.get("x-admin-login") === "1";
  const authenticated = await isAuthenticated();

  if (!isLoginPage && !authenticated) {
    redirect(adminConfig.loginPath);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!isLoginPage && (
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">{adminConfig.title}</h1>
              <div className="flex gap-4 items-center">
                {adminConfig.navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
