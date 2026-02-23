// POST /api/admin/menu-import
// Accepts CSV upload and upserts menu items.
// Implemented by: Dev C
//
// CSV Format (strict):
// name,image_url,price
// Fish Fry,https://img.com/fish.jpg,250
//
// Rules:
//  - First row = headers
//  - Parse and upsert items
//  - Disable items not present in CSV
//  - Return import report

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // TODO (Dev C): Implement CSV menu import
  return NextResponse.json({ message: "Menu import API — not yet implemented" }, { status: 501 });
}
