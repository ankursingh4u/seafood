// POST /api/orders
// Creates a new pickup order.
// Implemented by: Dev B
//
// Input:
// {
//   "items": [{ "dish_id": "", "name": "", "price": 0, "qty": 0 }],
//   "customer_name": "",
//   "phone": "",
//   "notes": "" (optional)
// }
//
// Rules:
//  - Recalculate total from DB prices (never trust frontend total)
//  - Set status = "PENDING"
//  - Return order ID
//  - Trigger notification (WhatsApp / Email / Admin realtime)

import { NextRequest, NextResponse } from "next/server";
import { CreateOrderPayload } from "@/types/order";

export async function POST(req: NextRequest) {
  const body: CreateOrderPayload = await req.json();

  if (!body.customer_name || !body.phone || !body.items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // TODO (Dev B): Implement order creation
  // 1. Fetch prices from DB for each dish_id
  // 2. Recalculate total
  // 3. Insert into orders table with status = "PENDING"
  // 4. Trigger notification
  // 5. Return { order_id }

  return NextResponse.json({ message: "Orders API — not yet implemented" }, { status: 501 });
}
