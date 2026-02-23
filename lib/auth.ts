import { createHmac } from "crypto";
import { NextRequest } from "next/server";

export const ADMIN_COOKIE = "admin_token";

// Generates a deterministic token from both ADMIN_USERNAME and ADMIN_PASSWORD.
// Changing either credential automatically invalidates all existing sessions.
export function generateAdminToken(): string {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username) throw new Error("ADMIN_USERNAME is not set in environment variables.");
  if (!password) throw new Error("ADMIN_PASSWORD is not set in environment variables.");
  return createHmac("sha256", `${username}:${password}`).update("saltys-admin-v1").digest("hex");
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
