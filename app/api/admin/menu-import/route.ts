import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getSupabase } from "@/lib/db";
import { parseCsv } from "@/lib/csv";

export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const csvText = await file.text();
  let rows;

  try {
    rows = parseCsv(csvText);
  } catch {
    return NextResponse.json({ error: "Invalid CSV format" }, { status: 422 });
  }

  if (!rows.length) {
    return NextResponse.json({ error: "CSV has no data rows" }, { status: 422 });
  }

  const supabase = getSupabase();

  // Upsert items from CSV (insert new, update existing by name)
  const { data: upserted, error: upsertError } = await supabase
    .from("menu_items")
    .upsert(
      rows.map((r) => ({
        name: r.name,
        image_url: r.image_url,
        price: r.price,
        active: true,
        ...(r.category ? { category: r.category } : {}),
      })),
      { onConflict: "name" }
    )
    .select();

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // Deactivate items NOT present in the CSV
  const { data: allItems } = await supabase.from("menu_items").select("id, name");
  const csvNames = new Set(rows.map((r) => r.name));
  const toDeactivate = (allItems ?? []).filter((i) => !csvNames.has(i.name)).map((i) => i.id);

  if (toDeactivate.length > 0) {
    await supabase.from("menu_items").update({ active: false }).in("id", toDeactivate);
  }

  return NextResponse.json({
    imported: upserted?.length ?? 0,
    deactivated: toDeactivate.length,
    items: upserted,
  });
}
