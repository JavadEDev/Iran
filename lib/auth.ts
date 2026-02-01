"use server";

import { cookies } from "next/headers";

// Simple session-based auth (replace with Neon Auth when available)
const ADMIN_SESSION_KEY = "admin_session";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin"; // Should be changed in production

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_KEY);
  return session?.value === "authenticated";
}

export async function authenticate(password: string): Promise<boolean> {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_KEY, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    return true;
  }
  return false;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_KEY);
}
