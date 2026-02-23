import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db";

// GET /api/orders/[id] — public: customer polls their own order status
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("id, status, customer_name, total, created_at")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
