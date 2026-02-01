"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/actions/auth";
import { adminConfig } from "@/lib/config/admin";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push(adminConfig.loginPath);
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
    >
      Logout
    </button>
  );
}
