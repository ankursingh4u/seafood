import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getSupabase } from "@/lib/db";
import { OrderStatus } from "@/types/order";

const VALID_STATUSES: OrderStatus[] = ["PENDING", "PREPARING", "READY"];

// PATCH /api/admin/orders/[id] — update order status only
// Auth: admin cookie required
//
// Request body: { status: "PENDING" | "PREPARING" | "READY" }
// Response: updated order row
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  let body: { status?: OrderStatus };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { status } = body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[PATCH /api/admin/orders/[id]]", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
