"use client";

import { useState, useEffect, useRef } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { MenuItem, CartItem } from "@/types/menu";

const CART_KEY = "saltys_cart";

function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// ── Categories — keyed exactly as stored in DB ─────────────────────────
const CATEGORIES = [
  { key: "all",     label: "All",               icon: "🌊", color: "#0d1f2d"  },
  { key: "pick",    label: "Seafood Pick n Go",  icon: "🦐", color: "#e05c2a"  },
  { key: "burgers", label: "Burgers & Wraps",    icon: "🍔", color: "#d97706"  },
  { key: "fish",    label: "Fish Selection",      icon: "🐟", color: "#0369a1"  },
  { key: "basket",  label: "Seafood Basket",      icon: "🧺", color: "#0d9488"  },
  { key: "daily",   label: "Daily Specials",      icon: "⭐", color: "#dc2626"  },
  { key: "lunch",   label: "Lunch Specials",      icon: "☀️", color: "#ca8a04"  },
  { key: "kids",    label: "Kids Meals",          icon: "🧒", color: "#7c3aed"  },
  { key: "drinks",  label: "Drinks",              icon: "🥤", color: "#0891b2"  },
  { key: "chips",   label: "Chips n Sauces",      icon: "🍟", color: "#16a34a"  },
];

// ── Filter bar with sliding indicator ─────────────────────────────────
function FilterBar({
  active,
  counts,
  onChange,
}: {
  active: string;
  counts: Record<string, number>;
  onChange: (key: string) => void;
}) {
  const barRef       = useRef<HTMLDivElement>(null);
  const pillRefs     = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx       = CATEGORIES.findIndex((c) => c.key === active);
    const pill      = pillRefs.current[idx];
    const bar       = barRef.current;
    const indicator = indicatorRef.current;
    if (!pill || !bar || !indicator) return;

    const pr = pill.getBoundingClientRect();
    const br = bar.getBoundingClientRect();
    indicator.style.width     = `${pr.width}px`;
    indicator.style.transform = `translateX(${pr.left - br.left + bar.scrollLeft}px)`;
    pill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [active]);

  const activeCat = CATEGORIES.find((c) => c.key === active);

  return (
    <div
      className="sticky z-20 border-b"
      style={{ top: 57, background: "#0d1f2d", borderColor: "rgba(255,255,255,0.07)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div
          ref={barRef}
          className="flex items-center gap-2 px-4 py-3.5 overflow-x-auto relative"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Sliding colour underline */}
          <div
            ref={indicatorRef}
            className="absolute bottom-0 h-0.5 rounded-full transition-all duration-300"
            style={{ background: activeCat?.color ?? "#f59e0b", left: 0 }}
          />

          {CATEGORIES.map((cat, idx) => {
            const isActive = active === cat.key;
            const count    = counts[cat.key] ?? 0;
            return (
              <button
                key={cat.key}
                ref={(el) => { pillRefs.current[idx] = el; }}
                onClick={() => onChange(cat.key)}
                className="flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap"
                style={{
                  background: isActive ? cat.color : "rgba(255,255,255,0.07)",
                  color:      isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                  border:     isActive
                    ? `1.5px solid ${cat.color}`
                    : "1.5px solid rgba(255,255,255,0.1)",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {count > 0 && (
                  <span
                    className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.12)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Single item card ───────────────────────────────────────────────────
function ItemCard({
  item,
  qty,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const cat = CATEGORIES.find((c) => c.key === item.category);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col h-full"
      style={{
        border: "1px solid #f0e8dc",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        transition: "box-shadow 0.25s, transform 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 40px rgba(0,0,0,0.13)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 190 }}>
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover"
          style={{ transition: "transform 0.6s ease" }}
          onMouseEnter={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1.07)"; }}
          onMouseLeave={(e) => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x190/f0e8dc/e05c2a?text=🦞";
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: 64,
            background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
          }}
        />
        {/* Category badge — top left */}
        {cat && cat.key !== "all" && (
          <div
            className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ background: cat.color + "dd", backdropFilter: "blur(4px)" }}
          >
            <span>{cat.icon}</span>
          </div>
        )}
        {/* Price — bottom right on image */}
        <div
          className="absolute bottom-2.5 right-2.5 font-extrabold text-sm text-white px-2.5 py-1 rounded-xl"
          style={{ background: "rgba(13,31,45,0.85)", backdropFilter: "blur(6px)" }}
        >
          ${item.price.toFixed(2)}
        </div>
      </div>

      {/* Card body */}
      <div className="px-3.5 pt-3 pb-3.5 flex flex-col gap-3 flex-1">
        <p className="font-bold text-gray-900 text-sm leading-snug flex-1 line-clamp-2">
          {item.name}
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="font-extrabold text-base" style={{ color: "#1a8a4a" }}>
            ${item.price.toFixed(2)}
          </p>
          {qty === 0 ? (
            <button
              onClick={onAdd}
              className="text-white text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 hover:opacity-90"
              style={{ background: "#e05c2a" }}
            >
              ADD
            </button>
          ) : (
            <div
              className="flex items-center gap-1.5 rounded-xl px-1.5 py-1"
              style={{ background: "#fff4ef", border: "1px solid #fcd4bc" }}
            >
              <button
                onClick={onRemove}
                className="w-6 h-6 rounded-lg bg-white text-xs font-extrabold flex items-center justify-center active:scale-90"
                style={{ color: "#e05c2a", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                −
              </button>
              <span
                className="w-5 text-center font-extrabold text-sm"
                style={{ color: "#e05c2a" }}
              >
                {qty}
              </span>
              <button
                onClick={onAdd}
                className="w-6 h-6 rounded-lg text-white text-xs font-extrabold flex items-center justify-center active:scale-90"
                style={{ background: "#e05c2a" }}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Item grid (defined outside MenuPage to avoid React remount issues) ──
function ItemGrid({
  items,
  cartQty,
  onAdd,
  onRemove,
}: {
  items: MenuItem[];
  cartQty: (id: string) => number;
  onAdd: (item: MenuItem) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div
          key={item.id}
          style={{ animation: `slideTextIn 0.35s ease-out ${i * 0.04}s both` }}
        >
          <ItemCard
            item={item}
            qty={cartQty(item.id)}
            onAdd={() => onAdd(item)}
            onRemove={() => onRemove(item.id)}
          />
        </div>
      ))}
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────
export default function MenuPage() {
  const [items,          setItems]          = useState<MenuItem[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [cart,           setCart]           = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [animKey,        setAnimKey]        = useState(0);

  useEffect(() => {
    setCart(getCart());
    fetch("/api/menu")
      .then((r) => r.json())
      .then((data) => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function changeCategory(key: string) {
    setActiveCategory(key);
    setAnimKey((k) => k + 1);
  }

  // Per-category counts
  const counts: Record<string, number> = { all: items.length };
  CATEGORIES.slice(1).forEach((cat) => {
    counts[cat.key] = items.filter((i) => i.category === cat.key).length;
  });

  const visibleItems =
    activeCategory === "all"
      ? items
      : items.filter((i) => i.category === activeCategory);

  // Grouped data for the "All" view
  const groupedItems = CATEGORIES.slice(1)
    .map((cat) => ({ cat, items: items.filter((i) => i.category === cat.key) }))
    .filter((g) => g.items.length > 0);

  function cartQty(id: string) {
    return cart.find((c) => c.dish_id === id)?.qty ?? 0;
  }

  function addToCart(item: MenuItem) {
    const updated = [...cart];
    const idx     = updated.findIndex((c) => c.dish_id === item.id);
    if (idx >= 0) {
      updated[idx] = { ...updated[idx], qty: updated[idx].qty + 1 };
    } else {
      updated.push({ dish_id: item.id, name: item.name, price: item.price, qty: 1 });
    }
    setCart(updated);
    saveCart(updated);
  }

  function removeFromCart(id: string) {
    const updated = cart
      .map((c) => (c.dish_id === id ? { ...c, qty: c.qty - 1 } : c))
      .filter((c) => c.qty > 0);
    setCart(updated);
    saveCart(updated);
  }

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const activeCat = CATEGORIES.find((c) => c.key === activeCategory);

  return (
    <div className="flex flex-col" style={{ background: "#fdf9f4" }}>
      <SiteHeader />

      {/* ── Hero banner ────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: "46vh", minHeight: 260 }}>
        <div
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: "url(/images/gastro-editorial-PkByBrVtQco-unsplash.jpg)",
            backgroundPosition: "center 55%",
            animation: "kenBurns 16s ease-out forwards",
          }}
        />
        {/* Left-heavy gradient for text readability */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(110deg, rgba(5,12,20,0.92) 0%, rgba(5,12,20,0.55) 55%, rgba(5,12,20,0.1) 100%)" }} />
        {/* Bottom fade to merge with filter bar */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0d1f2d 0%, transparent 45%)" }} />

        <div className="absolute inset-0 flex flex-col justify-end px-6 sm:px-14 pb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-10" style={{ background: "#e05c2a" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#f59e0b" }}>
              Made to order · Pickup only
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-none mb-2">
            Our Menu
          </h1>
          {!loading && (
            <p className="text-white/40 text-sm">
              {items.length} dishes &nbsp;·&nbsp; {groupedItems.length} categories &nbsp;·&nbsp; Order in 60 seconds
            </p>
          )}
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────── */}
      <FilterBar active={activeCategory} counts={counts} onChange={changeCategory} />

      {/* ── Main content ───────────────────────────────────── */}
      <main className="max-w-5xl mx-auto w-full px-4 py-7 pb-36">

        {/* Section header row */}
        {!loading && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">{activeCat?.icon}</span>
              <h2 className="font-extrabold text-gray-900 text-lg">
                {activeCat?.label ?? "All"}
              </h2>
              <span className="text-gray-400 text-sm">
                ({visibleItems.length} {visibleItems.length === 1 ? "item" : "items"})
              </span>
            </div>
            {activeCategory !== "all" && (
              <button
                onClick={() => changeCategory("all")}
                className="text-xs font-semibold transition"
                style={{ color: "#e05c2a" }}
              >
                Show all ×
              </button>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden animate-pulse"
                style={{ border: "1px solid #f0e8dc" }}
              >
                <div className="bg-gray-100" style={{ height: 190 }} />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>

        ) : visibleItems.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-3">🌊</p>
            <p className="text-gray-500 font-semibold">No dishes in this category</p>
            <button
              onClick={() => changeCategory("all")}
              className="mt-4 text-sm font-bold px-6 py-2.5 rounded-full text-white transition"
              style={{ background: "#e05c2a" }}
            >
              Show all dishes
            </button>
          </div>

        ) : activeCategory === "all" ? (
          /* ── Grouped view ── */
          <div key={animKey} className="space-y-12">
            {groupedItems.map((group, gi) => (
              <section key={group.cat.key}>
                {/* Section heading — clickable to filter */}
                <div className="flex items-center gap-4 mb-5">
                  {/* Coloured accent bar */}
                  <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: group.cat.color }} />
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: group.cat.color + "18", border: `1px solid ${group.cat.color}30` }}
                  >
                    {group.cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-xl leading-none" style={{ color: group.cat.color }}>
                      {group.cat.label}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">
                      {group.items.length} {group.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <button
                    onClick={() => changeCategory(group.cat.key)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 shrink-0"
                    style={{ color: group.cat.color, background: group.cat.color + "12", border: `1px solid ${group.cat.color}25` }}
                  >
                    Filter →
                  </button>
                </div>
                {/* Thin divider below heading */}
                <div className="h-px mb-5" style={{ background: `linear-gradient(to right, ${group.cat.color}30, transparent)` }} />

                <div style={{ animation: `slideTextIn 0.4s ease-out ${gi * 0.05}s both` }}>
                  <ItemGrid
                    items={group.items}
                    cartQty={cartQty}
                    onAdd={addToCart}
                    onRemove={removeFromCart}
                  />
                </div>
              </section>
            ))}
          </div>

        ) : (
          /* ── Filtered flat view ── */
          <div key={animKey}>
            <ItemGrid
              items={visibleItems}
              cartQty={cartQty}
              onAdd={addToCart}
              onRemove={removeFromCart}
            />
          </div>
        )}
      </main>

      {/* ── Sticky cart bar ─────────────────────────────────── */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-5 pt-2">
          <div className="max-w-5xl mx-auto">
            <a
              href="/cart"
              className="flex items-center justify-between text-white px-5 py-4 rounded-2xl"
              style={{ background: "#0d1f2d", boxShadow: "0 8px 32px rgba(13,31,45,0.55)" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
                  style={{ background: "#e05c2a", color: "white" }}
                >
                  {totalItems}
                </span>
                <span className="font-semibold text-sm">View Cart</span>
              </div>
              <span className="font-extrabold" style={{ color: "#f59e0b" }}>
                ${totalPrice.toFixed(2)} →
              </span>
            </a>
          </div>
        </div>
      )}

      {/* ── Closing strip ───────────────────────────────────── */}
      <div style={{ background: "#0d1f2d" }}>
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-extrabold text-base mb-1">Can&apos;t find what you&apos;re after?</p>
            <p className="text-white/35 text-sm">Call us and we&apos;ll sort you out. We&apos;re open Mon–Sun, 11AM–9PM.</p>
          </div>
          <a
            href="tel:+61312345678"
            className="shrink-0 flex items-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition hover:opacity-80"
            style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.2)" }}
          >
            📞 (03) 1234 5678
          </a>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
