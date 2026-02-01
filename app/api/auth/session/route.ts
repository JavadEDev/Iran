import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

/**
 * GET /api/auth/session
 * Returns { authenticated: boolean } from the current session cookie.
 */
export async function GET() {
  const authenticated = await isAuthenticated();
  return NextResponse.json({ authenticated });
}
