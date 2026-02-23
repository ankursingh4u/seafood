import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth";
import { getSupabase } from "@/lib/db";

// Full menu from Salty's Seafood & Takeaway physical menu board
// Category keys match the filter bar on /menu: pick | burgers | fish | basket | daily | lunch | kids | drinks | chips
const SEED_ITEMS = [

  // ── SEAFOOD PICK N GO ─────────────────────────────────────────────
  {
    name: "Prawn Cutlet (per pcs)",
    price: 4.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Garlic Prawns (5 pcs)",
    price: 8.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1599031282888-a54a72ca25e4?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Prawn Spring Rolls (8 pcs)",
    price: 12.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Prawn n Ginger Dumpling (5 pcs)",
    price: 8.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Salt & Pepper Prawns (5 pcs)",
    price: 8.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Sea Scallops Roe On (per pcs)",
    price: 5.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Calamari Rings (6 pcs)",
    price: 12.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Calamari Rings (12 pcs)",
    price: 20.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Salt & Pepper Squid Stick (5 pcs)",
    price: 8.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Battered Flathead (3 pcs)",
    price: 9.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Seafood Bite (3 pcs)",
    price: 6.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Seafood Stick",
    price: 4.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Fish Cake (1 pcs)",
    price: 5.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Fish Bites Battered (12 pcs)",
    price: 14.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Chicken Garlic Balls (2 pcs)",
    price: 4.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Chicken Nuggets (10 pcs)",
    price: 10.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Chicko Roll",
    price: 5.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Corn Jack",
    price: 5.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Spring Roll",
    price: 5.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Kabana",
    price: 5.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Pluto Pop",
    price: 5.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Battered Sausage",
    price: 6.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Crumbed Sausage",
    price: 5.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Dim Sim (2 pcs)",
    price: 4.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Onion Rings Battered (10 pcs)",
    price: 8.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1585325701956-60dd9c8399b6?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Crab Claws (each)",
    price: 5.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Salad",
    price: 11.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Cheese and Bacon Potato Scallop",
    price: 5.50,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f81b376d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "NZ Jumbo Oysters (Dozen)",
    price: 46.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "NZ Jumbo Oysters (Half Dozen)",
    price: 26.00,
    category: "pick",
    image_url: "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=600&q=80&fit=crop",
    active: true,
  },

  // ── BURGERS & WRAPS ───────────────────────────────────────────────
  {
    name: "Fish Burger",
    price: 15.00,
    category: "burgers",
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Chicken Burger",
    price: 15.00,
    category: "burgers",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Beef Burger",
    price: 15.00,
    category: "burgers",
    image_url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Beef Works",
    price: 18.00,
    category: "burgers",
    image_url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Veggie Burger",
    price: 14.00,
    category: "burgers",
    image_url: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Chicken / Fish / Calamari Burger",
    price: 15.00,
    category: "burgers",
    image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80&fit=crop",
    active: true,
  },

  // ── FISH SELECTION ────────────────────────────────────────────────
  {
    name: "Fresh Barramundi (270gm)",
    price: 22.00,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1611171711791-00be7b1d68e1?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Orange Roughy (250gm)",
    price: 19.00,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Gold Band Snapper (250gm)",
    price: 18.50,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Red Emperor (250gm)",
    price: 18.50,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Barramundi (250gm)",
    price: 17.50,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1611171711791-00be7b1d68e1?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Salmon (250gm)",
    price: 17.50,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Blue Dot Hake / COD (250gm)",
    price: 16.50,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Hoki (200gm)",
    price: 14.50,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Bassa Fillet (200gm)",
    price: 13.00,
    category: "fish",
    image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&fit=crop",
    active: true,
  },

  // ── SEAFOOD BASKET ────────────────────────────────────────────────
  {
    name: "Value Basket",
    price: 20.00,
    category: "basket",
    image_url: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Premium Basket",
    price: 26.00,
    category: "basket",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Family Pack For 4",
    price: 59.00,
    category: "basket",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Family Pack For 6",
    price: 72.00,
    category: "basket",
    image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80&fit=crop",
    active: true,
  },

  // ── DAILY SPECIALS ────────────────────────────────────────────────
  {
    name: "6 Battered/Crumbed Calamari + Chips + Sauce",
    price: 16.00,
    category: "daily",
    image_url: "https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Fish and Chips",
    price: 14.00,
    category: "daily",
    image_url: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Cheesy Garlic Large Chips",
    price: 19.50,
    category: "daily",
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f81b376d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Large Chips Cheese and Gravy",
    price: 19.00,
    category: "daily",
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f81b376d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Barramundi Crumbed + Chips",
    price: 15.00,
    category: "daily",
    image_url: "https://images.unsplash.com/photo-1611171711791-00be7b1d68e1?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "8 Crumbed Whiting + Chips",
    price: 16.00,
    category: "daily",
    image_url: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80&fit=crop",
    active: true,
  },

  // ── LUNCH SPECIALS (11AM–4PM) ─────────────────────────────────────
  {
    name: "Combo 1: Hoki + Chips + Salad",
    price: 16.00,
    category: "lunch",
    image_url: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Combo 2: COD + Chips + Salad",
    price: 18.00,
    category: "lunch",
    image_url: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Combo 3: Beef Burger + Chips + Can Drink",
    price: 17.00,
    category: "lunch",
    image_url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Combo 4: 2 pcs Flathead + Chips + Salad",
    price: 14.00,
    category: "lunch",
    image_url: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Combo 5: Fish Burger + Chips + Can Drink",
    price: 17.00,
    category: "lunch",
    image_url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80&fit=crop",
    active: true,
  },

  // ── KIDS MEALS WITH JUICE POPPER ──────────────────────────────────
  {
    name: "Kids Fish n Chips + Juice Popper",
    price: 13.00,
    category: "kids",
    image_url: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Kids Nuggets n Chips + Juice Popper",
    price: 13.00,
    category: "kids",
    image_url: "https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80&fit=crop",
    active: true,
  },

  // ── DRINKS ────────────────────────────────────────────────────────
  {
    name: "Thick Shake",
    price: 9.50,
    category: "drinks",
    image_url: "https://images.unsplash.com/photo-1572490122747-3e9e8f1e5c90?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Milk Shake",
    price: 8.00,
    category: "drinks",
    image_url: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=600&q=80&fit=crop",
    active: true,
  },

  // ── CHIPS N SAUCES ────────────────────────────────────────────────
  {
    name: "Chips Small",
    price: 8.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f81b376d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Chips Medium",
    price: 10.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f81b376d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Chips Large",
    price: 15.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f81b376d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Sweet Potato Chips",
    price: 9.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Potato Wedges",
    price: 6.50,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Potato Scallop",
    price: 3.50,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1576107232684-1279f81b376d?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Small Gravy",
    price: 3.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Large Gravy",
    price: 5.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Small Curry Sauce",
    price: 3.50,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Large Curry Sauce",
    price: 6.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Sauce Sachets",
    price: 0.50,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Pineapple Fritters",
    price: 3.00,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&q=80&fit=crop",
    active: true,
  },
  {
    name: "Sauce Tubs",
    price: 2.50,
    category: "chips",
    image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop",
    active: true,
  },
];

// POST /api/admin/seed — seed the full Salty's menu
// Safe to run multiple times: inserts new items and updates category on existing items
export async function POST(req: NextRequest) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  // Fetch all existing items (name + id)
  const { data: existing, error: fetchError } = await supabase
    .from("menu_items")
    .select("id, name");

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  const existingMap = new Map((existing ?? []).map((e: { id: string; name: string }) => [e.name, e.id]));

  const toInsert = SEED_ITEMS.filter((item) => !existingMap.has(item.name));
  const toUpdate = SEED_ITEMS.filter((item) => existingMap.has(item.name));

  let inserted = 0;
  let updated = 0;
  const errors: string[] = [];

  // Insert new items
  if (toInsert.length > 0) {
    const { data, error } = await supabase
      .from("menu_items")
      .insert(toInsert)
      .select();

    if (error) {
      errors.push(`Insert error: ${error.message}`);
    } else {
      inserted = data?.length ?? 0;
    }
  }

  // Update category on existing items
  for (const item of toUpdate) {
    const id = existingMap.get(item.name);
    const { error } = await supabase
      .from("menu_items")
      .update({ category: item.category })
      .eq("id", id);

    if (error) {
      errors.push(`Update error (${item.name}): ${error.message}`);
    } else {
      updated++;
    }
  }

  return NextResponse.json({
    message: `Seed complete. ${inserted} inserted, ${updated} updated.`,
    inserted,
    updated,
    total: SEED_ITEMS.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
