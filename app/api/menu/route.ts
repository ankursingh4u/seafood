// GET /api/menu
// Returns active menu items only.
// Implemented by: Dev B

import { NextResponse } from "next/server";

export async function GET() {
  // TODO (Dev B): Query DB for active menu items
  // Example:
  // const items = await db.query("SELECT * FROM menu_items WHERE active = true");
  // return NextResponse.json(items);

  return NextResponse.json({ message: "Menu API — not yet implemented" }, { status: 501 });
}
