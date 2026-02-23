import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getSupabase } from "@/lib/db";

// GET /api/admin/menu — all items including inactive
export async function GET(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/admin/menu — add new item
export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, image_url, price } = await req.json();

  if (!name?.trim() || !image_url?.trim() || price == null || isNaN(Number(price))) {
    return NextResponse.json({ error: "Required: name, image_url, price" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("menu_items")
    .insert({ name: name.trim(), image_url: image_url.trim(), price: Number(price), active: true })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
