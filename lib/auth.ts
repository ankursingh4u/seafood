import { createHmac } from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_token";

// Generates a deterministic token from ADMIN_PASSWORD.
// Changing ADMIN_PASSWORD automatically invalidates all existing sessions.
export function generateAdminToken(): string {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD is not set in environment variables.");
  return createHmac("sha256", password).update("saltys-admin-v1").digest("hex");
}

export function verifyAdminRequest(req: NextRequest): boolean {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    return token === generateAdminToken();
  } catch {
    return false;
  }
}
