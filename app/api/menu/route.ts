// GET /api/menu
// Returns active menu items only.

import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("menu_items")
    .select("id, name, image_url, price, active, created_at, category")
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[GET /api/menu]", error.message);
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }

  return NextResponse.json(data);
}
