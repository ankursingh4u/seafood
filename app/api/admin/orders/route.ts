import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getSupabase } from "@/lib/db";

// GET /api/admin/orders — all orders, newest first
// Auth: admin cookie required
//
// TODO (Dev C): Add optional query params if needed, e.g.:
//   ?status=PENDING  → filter by status
//   ?limit=50        → pagination
// The base query below returns everything sorted by created_at desc.
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[GET /api/admin/orders]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
