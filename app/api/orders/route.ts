// POST /api/orders
// Creates a new pickup order.
//
// Price is ALWAYS recalculated from DB — frontend total is ignored.
// Supabase realtime automatically broadcasts the insert to the admin dashboard.
// Owner also receives an email notification via Nodemailer.

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/db";
import { sendOrderEmail } from "@/lib/notify";
import { CreateOrderPayload, Order } from "@/types/order";

export async function POST(req: NextRequest) {
  let body: CreateOrderPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { customer_name, phone, items, notes } = body;

  if (!customer_name?.trim() || !phone?.trim() || !items?.length) {
    return NextResponse.json({ error: "Missing required fields: customer_name, phone, items" }, { status: 400 });
  }

  // 1. Fetch real prices from DB for submitted dish IDs
  const dishIds = items.map((i) => i.dish_id);

  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select("id, name, price, active")
    .in("id", dishIds)
    .eq("active", true);

  if (menuError) {
    console.error("[POST /api/orders] menu fetch error:", menuError.message);
    return NextResponse.json({ error: "Failed to validate items" }, { status: 500 });
  }

  // 2. Validate all items exist and are active
  const priceMap = new Map(menuItems.map((m) => [m.id, m]));

  for (const item of items) {
    if (!priceMap.has(item.dish_id)) {
      return NextResponse.json(
        { error: `Item not available: ${item.dish_id}` },
        { status: 422 }
      );
    }
    if (item.qty < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 422 });
    }
  }

  // 3. Build verified items with DB prices (ignore frontend prices entirely)
  const verifiedItems = items.map((item) => {
    const dbItem = priceMap.get(item.dish_id)!;
    return {
      dish_id: item.dish_id,
      name: dbItem.name,
      price: dbItem.price,
      qty: item.qty,
    };
  });

  // 4. Recalculate total from DB prices
  const total = verifiedItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 5. Insert order into DB
  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      items: verifiedItems,
      total,
      customer_name: customer_name.trim(),
      phone: phone.trim(),
      notes: notes?.trim() ?? null,
      status: "PENDING",
    })
    .select()
    .single();

  if (insertError) {
    console.error("[POST /api/orders] insert error:", insertError.message);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }

  // 6. Send email notification (non-blocking — don't fail order if email fails)
  sendOrderEmail(order as Order).catch((err) => {
    console.error("[POST /api/orders] email notification failed:", err.message);
  });

  // Supabase realtime auto-broadcasts the INSERT to the admin dashboard.
  // No extra step needed here.

  return NextResponse.json({ order_id: order.id }, { status: 201 });
}
