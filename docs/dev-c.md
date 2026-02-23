# Dev C — Orders Dashboard Guide

**Branch:** `dev-c`
**Your job:** Build the real-time orders dashboard at `/admin/orders`.

---

## Setup

1. Clone the repo and switch to your branch:
   ```bash
   git clone https://github.com/ankursingh4u/seafood.git
   cd seafood
   git checkout dev-c
   npm install
   ```

2. Copy `.env.example` to `.env.local` and ask Dev B for the values:
   ```bash
   cp .env.example .env.local
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:3000/admin`

---

## What Is Already Done For You

Dev B (backend) already built everything server-side. You are building the UI only.

| Already done | Where |
|---|---|
| Auth (admin cookie login) | `/admin` page — login is already there |
| GET all orders API | `GET /api/admin/orders` |
| Update status API | `PATCH /api/admin/orders/[id]` |
| Order type definition | `types/order.ts` |
| Orders stub page | `app/admin/orders/page.tsx` |
| "Orders" link in admin header | `app/admin/page.tsx` — already added |

---

## Your File

**`app/admin/orders/page.tsx`** — this is the only file you need to edit.

It already has:
- Auth-aware (APIs check cookie automatically)
- Initial data fetch stub (`GET /api/admin/orders`)
- Basic structure and placeholder UI

Replace the stub UI with a proper orders dashboard.

---

## APIs

### GET /api/admin/orders — All orders

```typescript
const res = await fetch('/api/admin/orders');
const orders = await res.json(); // Order[]
```

Returns all orders sorted newest first. No extra setup needed — auth cookie is sent automatically by the browser.

### PATCH /api/admin/orders/[id] — Update status

```typescript
const res = await fetch(`/api/admin/orders/${order.id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'PREPARING' })
});
const updated = await res.json(); // Order
```

Valid status values: `"PENDING"` → `"PREPARING"` → `"READY"`

---

## Order Type

```typescript
// types/order.ts
type OrderStatus = "PENDING" | "PREPARING" | "READY";

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customer_name: string;
  phone: string;
  notes?: string | null;
  status: OrderStatus;
  created_at: string;
}

interface OrderItem {
  dish_id: string;
  name: string;
  price: number;
  qty: number;
}
```

---

## Real-Time Orders (Supabase Realtime)

New orders need to appear without refreshing. Use Supabase Realtime to subscribe to the `orders` table.

**Install the Supabase browser client:**
```bash
npm install @supabase/supabase-js
```

**Subscription code — add this inside your component:**

```typescript
import { createClient } from '@supabase/supabase-js';
import { Order } from '@/types/order';

// At top of component (outside useEffect):
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Inside useEffect (after the initial fetch):
useEffect(() => {
  const channel = supabase
    .channel('orders-realtime')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'orders' },
      (payload) => {
        // New order came in — add to top of list
        setOrders((prev) => [payload.new as Order, ...prev]);
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'orders' },
      (payload) => {
        // Status was updated — refresh that order in list
        setOrders((prev) =>
          prev.map((o) => (o.id === payload.new.id ? (payload.new as Order) : o))
        );
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

**Important:** You need `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local`. Ask Dev B for these.

The anon key is safe to use in the browser — Supabase Row Level Security (RLS) controls access. For the realtime subscription, the orders table needs the realtime publication enabled (Dev B sets this up in Supabase Dashboard → Database → Replication → `orders` table).

---

## Recommended UI Structure

### Status Badge Colors
```
PENDING   → yellow  (bg-yellow-100 text-yellow-700)
PREPARING → blue    (bg-blue-100 text-blue-700)
READY     → green   (bg-green-100 text-green-700)
```

### Order Card Layout
```
┌─────────────────────────────────────────────┐
│  Rahul          [PENDING]      ₹480         │
│  9876543210     [→ PREPARING]               │
│  Jan 1, 2:30 PM                             │
│─────────────────────────────────────────────│
│  2x Grilled Prawns         ₹250 each        │
│  1x Fish Curry             ₹180             │
│─────────────────────────────────────────────│
│  Note: Extra spicy                          │
└─────────────────────────────────────────────┘
```

### Action Buttons Logic
```typescript
function nextStatus(current: OrderStatus): OrderStatus | null {
  if (current === 'PENDING') return 'PREPARING';
  if (current === 'PREPARING') return 'READY';
  return null; // READY has no next step
}
```

Show a button with the next status label. Hide the button when status is `READY`.

---

## Do NOT Touch

- `app/admin/page.tsx` — Dev B's menu management page (your Orders link is already in its header)
- `app/api/` — all backend routes (Dev B built these)
- `app/menu/`, `app/cart/`, `app/checkout/`, `app/success/`, `app/page.tsx` — Dev A's pages
- `lib/`, `types/`, `db/` — shared utilities

---

## Questions?

Check `README.md` in the root for the full API spec. Ask Dev B (repo owner) if an API response looks wrong or if you need the env vars.
