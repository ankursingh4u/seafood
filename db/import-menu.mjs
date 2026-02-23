// Quick local menu import script
// Usage: node db/import-menu.mjs db/seed.csv
//
// This is a DEV TOOL ONLY — not part of the app.
// For production, Dev C builds the CSV import via /admin UI.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const [, , csvPath] = process.argv;

if (!csvPath) {
  console.error("Usage: node db/import-menu.mjs <path-to-csv>");
  process.exit(1);
}

// Load env manually (reads .env.local)
const envFile = readFileSync(".env.local", "utf-8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

// Parse CSV
const csv = readFileSync(csvPath, "utf-8");
const [_header, ...rows] = csv.trim().split("\n");

const items = rows
  .filter((r) => r.trim())
  .map((row) => {
    const [name, image_url, price] = row.split(",").map((v) => v.trim());
    return { name, image_url, price: parseFloat(price), active: true };
  });

console.log(`Importing ${items.length} items...`);

// Upsert based on name (update if exists, insert if new)
const { data, error } = await supabase
  .from("menu_items")
  .upsert(items, { onConflict: "name", ignoreDuplicates: false })
  .select();

if (error) {
  console.error("Import failed:", error.message);
  process.exit(1);
}

console.log(`✓ Imported ${data.length} items successfully:`);
data.forEach((item) => console.log(`  - ${item.name} @ ₹${item.price}`));
