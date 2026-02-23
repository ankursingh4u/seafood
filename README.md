# Saltys Seafood & Takeaway

Web-based seafood pickup ordering app. No customer login. Fast ordering. Owner never misses an order.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL

## Getting Started

```bash
npm install
cp .env.example .env.local
# Fill in your .env.local values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Team Split

| Dev   | Responsibility              |
|-------|-----------------------------|
| Dev A | Customer frontend (pages)   |
| Dev B | Backend + Orders API + DB   |
| Dev C | Admin panel + Menu import   |

**Shared contract = API spec + DB schemas. Do not change locked contracts.**

---

## API Contracts (LOCKED)

### `GET /api/menu`
Returns active menu items.

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Fish Fry",
    "image_url": "https://...",
    "price": 250,
    "active": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

### `POST /api/orders`
Place a new pickup order.

**Request:**
```json
{
  "items": [
    { "dish_id": "uuid", "name": "Fish Fry", "price": 250, "qty": 2 }
  ],
  "customer_name": "John",
  "phone": "9999999999",
  "notes": "Extra spicy"
}
```

**Response:**
```json
{ "order_id": "uuid" }
```

---

### `POST /api/admin/menu-import`
Upload CSV to update the menu.

**CSV Format:**
```
name,image_url,price
Fish Fry,https://img.com/fish.jpg,250
Prawn Curry,https://img.com/prawn.jpg,320
```

---

## Database Schemas (LOCKED)

### `menu_items`
| Column     | Type      |
|------------|-----------|
| id         | uuid (PK) |
| name       | string    |
| image_url  | string    |
| price      | number    |
| active     | boolean   |
| created_at | timestamp |

### `orders`
| Column        | Type                            |
|---------------|---------------------------------|
| id            | uuid (PK)                       |
| items         | json                            |
| total         | number                          |
| customer_name | string                          |
| phone         | string                          |
| status        | PENDING \| PREPARING \| READY   |
| created_at    | timestamp                       |

---

## Cart LocalStorage Format (LOCKED)

```json
{
  "cart": [
    {
      "dish_id": "string",
      "name": "string",
      "price": 0,
      "qty": 0
    }
  ]
}
```

---

## How to Import Menu

1. Go to `/admin`
2. Log in with admin password
3. Upload a CSV with format: `name,image_url,price`
4. Click Import — dishes will be upserted, missing ones deactivated

---

## Admin URL

`/admin`
