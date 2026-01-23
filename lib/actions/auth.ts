"use server";

import { authenticate as authCheck, logout as logoutAction } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function authenticate(password: string) {
  const success = await authCheck(password);
  if (success) {
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function logout() {
  await logoutAction();
  redirect("/admin/login");
}
