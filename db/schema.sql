-- Saltys Seafood & Takeaway — Supabase Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ─────────────────────────────────────────────
-- TABLE: menu_items
-- ─────────────────────────────────────────────
create table if not exists menu_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  image_url   text not null,
  price       numeric(10, 2) not null check (price >= 0),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- TABLE: orders
-- ─────────────────────────────────────────────
create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  items          jsonb not null,
  total          numeric(10, 2) not null,
  customer_name  text not null,
  phone          text not null,
  notes          text,
  status         text not null default 'PENDING'
                   check (status in ('PENDING', 'PREPARING', 'READY')),
  created_at     timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- REALTIME — enable for admin dashboard
-- ─────────────────────────────────────────────
-- Run these to allow Supabase Realtime to broadcast order inserts/updates:
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table menu_items;

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
-- menu_items: public read, service-key-only write
alter table menu_items enable row level security;

create policy "Public can read active menu"
  on menu_items for select
  using (active = true);

-- orders: no public read (admin only via service key)
alter table orders enable row level security;
-- (No public policies — all order access via service key in API routes)

-- ─────────────────────────────────────────────
-- SAMPLE DATA (optional, for testing)
-- ─────────────────────────────────────────────
-- insert into menu_items (name, image_url, price) values
--   ('Fish Fry', 'https://via.placeholder.com/300?text=Fish+Fry', 250),
--   ('Prawn Curry', 'https://via.placeholder.com/300?text=Prawn+Curry', 320),
--   ('Calamari', 'https://via.placeholder.com/300?text=Calamari', 280);
