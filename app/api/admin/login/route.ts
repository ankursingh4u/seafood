import { NextRequest, NextResponse } from "next/server";
import { generateAdminToken, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (
    !username || !password ||
    username !== validUsername ||
    password !== validPassword
  ) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = generateAdminToken();
  const res = NextResponse.json({ ok: true });

  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return res;
}
