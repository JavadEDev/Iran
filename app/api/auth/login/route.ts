import { NextResponse } from "next/server";
import { authenticate } from "@/lib/auth";

/**
 * POST /api/auth/login
 * Body: { password: string }
 * Sets session cookie on success. Returns { success: true } or { success: false, error }.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = typeof body?.password === "string" ? body.password : "";
    const success = await authenticate(password);
    if (success) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { success: false, error: "Invalid password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Bad request" },
      { status: 400 }
    );
  }
}
