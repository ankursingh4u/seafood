# Dev A — Customer Frontend Guide

**Branch:** `dev-a`
**Your job:** Build the pages customers see — menu, cart, checkout, success.

---

## Setup

1. Clone the repo and switch to your branch:
   ```bash
   git clone https://github.com/ankursingh4u/seafood.git
   cd seafood
   git checkout dev-a
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
   App runs at `http://localhost:3000`

---

## Pages You Build

| Route | File | What it does |
|-------|------|-------------|
| `/` | `app/page.tsx` | Home / landing page |
| `/menu` | `app/menu/page.tsx` | Show menu, add to cart |
| `/cart` | `app/cart/page.tsx` | Cart with qty controls + checkout button |
| `/checkout` | `app/checkout/page.tsx` | Customer form → place order |
| `/success` | `app/success/page.tsx` | Order confirmed screen |

The file stubs already exist. Just open them and build.

---

## API You Use

### GET /api/menu — Fetch active menu items

```typescript
const res = await fetch('/api/menu');
const items = await res.json();
// items is MenuItem[]
```

**Response shape:**
```json
[
  {
    "id": "uuid",
    "name": "Grilled Prawns",
    "image_url": "https://...",
    "price": 250,
    "active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

Only active items are returned. No auth needed.

---

### POST /api/orders — Place an order

Call this from the checkout page after the customer fills the form.

**Request:**
```typescript
const res = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer_name: "Rahul",
    phone: "9876543210",
    notes: "Extra spicy",          // optional
    items: [
      { dish_id: "uuid", name: "Grilled Prawns", price: 250, qty: 2 }
    ]
  })
});
const data = await res.json();
// data.order_id  ← use this on the success page
```

**Success response (201):**
```json
{ "order_id": "uuid" }
```

**Error responses:**
- `400` — Missing fields
- `422` — Item not available or qty < 1
- `500` — DB error

**Important:** The backend always recalculates the total from DB prices. Never trust the frontend price. You can pass any price in `items[].price` — it gets ignored.

---

## Cart: localStorage Format

The cart is stored in `localStorage` under the key `"saltys_cart"`.

```typescript
// CartItem type (from types/menu.ts)
interface CartItem {
  dish_id: string;  // same as MenuItem.id
  name: string;
  price: number;
  qty: number;
}

// Read cart
const cart: CartItem[] = JSON.parse(localStorage.getItem('saltys_cart') || '[]');

// Save cart
localStorage.setItem('saltys_cart', JSON.stringify(cart));

// Clear cart (call this after successful order on /success)
localStorage.removeItem('saltys_cart');
```

---

## Typical Page Flow

```
/menu → user clicks "Add to cart"
         → save to localStorage
         → show cart badge/count

/cart → read localStorage
      → user adjusts qty or removes items
      → "Checkout" button → navigate to /checkout

/checkout → form: customer_name, phone, notes (optional)
          → on submit: POST /api/orders with cart items
          → on 201 success: clear localStorage, redirect to /success?order_id=xxx

/success → read ?order_id from URL
         → show confirmation message
         → "Order Again" → /menu
```

---

## Types (do not modify these files)

```typescript
// types/menu.ts
interface MenuItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
  active: boolean;
  created_at: string;
}

interface CartItem {
  dish_id: string;
  name: string;
  price: number;
  qty: number;
}
```

---

## Design Notes

- The app uses **Tailwind CSS** for styling. You can write any Tailwind classes.
- Match the warm orange (`orange-500`) accent from the admin panel for consistency.
- Keep it mobile-first — customers will mostly order from phones.

---

## Do NOT Touch

- `app/admin/` — admin pages (Dev C's territory)
- `app/api/` — all backend routes (Dev B built these)
- `lib/`, `types/`, `db/` — shared utilities
- `types/menu.ts`, `types/order.ts` — locked contracts

---

## Questions?

Check `README.md` in the root for the full API spec. Ask Dev B (repo owner) for env vars or if an API response looks wrong.
