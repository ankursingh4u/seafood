"use client";

import { useState, useEffect, useRef } from "react";
import { Order, OrderStatus } from "@/types/order";

// ─── Types ────────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
  active: boolean;
  category?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_OPTIONS = [
  { key: "pick",    label: "Seafood Pick n Go" },
  { key: "burgers", label: "Burgers & Wraps"   },
  { key: "fish",    label: "Fish Selection"     },
  { key: "basket",  label: "Seafood Basket"     },
  { key: "daily",   label: "Daily Specials"     },
  { key: "lunch",   label: "Lunch Specials"     },
  { key: "kids",    label: "Kids Meals"         },
  { key: "drinks",  label: "Drinks"             },
  { key: "chips",   label: "Chips n Sauces"     },
];

const CATEGORY_COLORS: Record<string, string> = {
  pick: "#e05c2a", burgers: "#d97706", fish:  "#0369a1",
  basket: "#0d9488", daily: "#dc2626", lunch: "#ca8a04",
  kids: "#7c3aed",  drinks: "#0891b2", chips: "#16a34a",
};

const STATUS_CONFIG: Record<OrderStatus, {
  label: string; color: string; bg: string; next: OrderStatus | null; nextLabel: string;
}> = {
  PENDING:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  next: "PREPARING", nextLabel: "Start Preparing" },
  PREPARING: { label: "Preparing", color: "#818cf8", bg: "rgba(129,140,248,0.15)", next: "READY",     nextLabel: "Mark Ready"      },
  READY:     { label: "Ready",     color: "#10b981", bg: "rgba(16,185,129,0.15)",  next: null,        nextLabel: ""                },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function catLabel(key?: string) {
  return CATEGORY_OPTIONS.find((c) => c.key === key)?.label ?? key ?? "—";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// Dark input style
const dinp =
  "border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500 w-full";

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) onLogin();
    else setError("Invalid username or password.");
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080d14" }}>
      <div
        className="p-8 rounded-2xl w-full max-w-sm"
        style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-3 mb-7">
          <span className="text-3xl">🦞</span>
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">Salty&apos;s Seafood</h1>
            <p className="text-white/30 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-white/30 text-xs mb-1.5 font-medium uppercase tracking-wider">Username</label>
            <input
              type="text" placeholder="Enter username"
              value={username} onChange={(e) => setUsername(e.target.value)}
              className={dinp} required autoFocus autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-white/30 text-xs mb-1.5 font-medium uppercase tracking-wider">Password</label>
            <input
              type="password" placeholder="Enter password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className={dinp} required autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 transition mt-1"
            style={{ background: "#e05c2a" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({
  orders,
  loading,
  updatingId,
  onAdvance,
}: {
  orders: Order[];
  loading: boolean;
  updatingId: string | null;
  onAdvance: (order: Order) => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-white/20 text-sm">Loading orders…</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-4xl mb-4">📋</p>
        <p className="text-white/30 font-medium">No orders yet</p>
        <p className="text-white/15 text-sm mt-1">New orders will appear here automatically</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const cfg        = STATUS_CONFIG[order.status];
        const isUpdating = updatingId === order.id;

        return (
          <div
            key={order.id}
            className="rounded-2xl p-4"
            style={{
              background:  "#111827",
              border:      "1px solid rgba(255,255,255,0.06)",
              borderLeft:  `3px solid ${cfg.color}`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left — customer + items */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-white font-bold text-sm">{order.customer_name}</p>
                  <span className="text-white/25 text-xs">{timeAgo(order.created_at)}</span>
                </div>
                <p className="text-white/35 text-xs mb-3">📞 {order.phone}</p>
                <div className="flex flex-wrap gap-1">
                  {order.items.map((item, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}
                    >
                      {item.qty}× {item.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — total + status + action */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <p className="text-white font-bold">${Number(order.total).toFixed(2)}</p>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  {cfg.label}
                </span>
                {cfg.next && (
                  <button
                    onClick={() => onAdvance(order)}
                    disabled={isUpdating}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg transition disabled:opacity-40"
                    style={{
                      background: cfg.color + "22",
                      color:      cfg.color,
                      border:     `1px solid ${cfg.color}40`,
                    }}
                  >
                    {isUpdating ? "…" : cfg.nextLabel}
                  </button>
                )}
              </div>
            </div>

            {/* Footer row */}
            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
              <p className="text-white/15 text-[11px] font-mono">#{order.id.slice(0, 8)}…</p>
              {order.notes && (
                <p className="text-white/25 text-xs italic truncate max-w-[260px]">💬 {order.notes}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Menu Tab ─────────────────────────────────────────────────────────────────

function MenuTab({
  items,
  loading,
  onRefresh,
}: {
  items: MenuItem[];
  loading: boolean;
  onRefresh: () => void;
}) {
  const [csvMsg,     setCsvMsg]     = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const [seedMsg,    setSeedMsg]    = useState("");
  const [seeding,    setSeeding]    = useState(false);
  const [showGuide,  setShowGuide]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form,    setForm]    = useState({ name: "", image_url: "", price: "", category: "" });
  const [formErr, setFormErr] = useState("");
  const [adding,  setAdding]  = useState(false);

  const [editId,   setEditId]   = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", image_url: "", price: "", category: "" });
  const [saving,   setSaving]   = useState(false);

  const activeCount = items.filter((i) => i.active).length;

  // ── Add
  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setFormErr(""); setAdding(true);
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, image_url: form.image_url,
        price: Number(form.price), category: form.category || null,
      }),
    });
    setAdding(false);
    if (res.ok) {
      setForm({ name: "", image_url: "", price: "", category: "" });
      onRefresh();
    } else {
      const d = await res.json();
      setFormErr(d.error || "Failed to add item");
    }
  }

  // ── Toggle
  async function toggleActive(item: MenuItem) {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    onRefresh();
  }

  // ── Delete
  async function deleteItem(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    onRefresh();
  }

  // ── Edit
  function startEdit(item: MenuItem) {
    setEditId(item.id);
    setEditForm({ name: item.name, image_url: item.image_url, price: String(item.price), category: item.category ?? "" });
  }

  async function saveEdit() {
    if (!editId) return;
    setSaving(true);
    await fetch(`/api/admin/menu/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name.trim(), image_url: editForm.image_url.trim(),
        price: Number(editForm.price), category: editForm.category || null,
      }),
    });
    setSaving(false);
    setEditId(null);
    onRefresh();
  }

  // ── CSV import
  async function importCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvLoading(true); setCsvMsg("");
    const fd = new FormData();
    fd.append("file", file);
    const res  = await fetch("/api/admin/menu-import", { method: "POST", body: fd });
    const data = await res.json();
    setCsvLoading(false);
    setCsvMsg(res.ok ? `✓ Imported ${data.imported}, deactivated ${data.deactivated}` : `✗ ${data.error}`);
    if (fileRef.current) fileRef.current.value = "";
    if (res.ok) onRefresh();
  }

  // ── Seed
  async function seedItems() {
    setSeeding(true); setSeedMsg("");
    const res  = await fetch("/api/admin/seed", { method: "POST" });
    const data = await res.json();
    setSeeding(false);
    setSeedMsg(res.ok ? `✓ ${data.message}` : `✗ ${data.error}`);
    if (res.ok) onRefresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

      {/* ── Left: tools ── */}
      <div className="lg:col-span-2 space-y-4">

        {/* Add dish */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-white font-semibold text-sm mb-4">Add New Dish</h3>
          <form onSubmit={addItem} className="space-y-3">
            <input placeholder="Dish name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={dinp} required />
            <input type="number" placeholder="Price ($) *" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={dinp} required />
            <input placeholder="Image URL *" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className={dinp} required />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={dinp}
              style={{ colorScheme: "dark" }}
            >
              <option value="" style={{ background: "#111827" }}>No category</option>
              {CATEGORY_OPTIONS.map((c) => <option key={c.key} value={c.key} style={{ background: "#111827" }}>{c.label}</option>)}
            </select>
            {formErr && <p className="text-red-400 text-xs">{formErr}</p>}
            <button type="submit" disabled={adding} className="w-full rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition" style={{ background: "#e05c2a" }}>
              {adding ? "Adding…" : "Add Dish"}
            </button>
          </form>
        </div>

        {/* CSV Import */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-white font-semibold text-sm">Import Menu via CSV</h3>
            <button onClick={() => setShowGuide(!showGuide)} className="text-xs text-blue-400 hover:text-blue-300 shrink-0">
              {showGuide ? "Hide" : "How to import →"}
            </button>
          </div>
          <p className="text-white/25 text-xs mb-4">Upload a CSV to bulk-add or update. Missing items will be disabled automatically.</p>

          {showGuide && (
            <div className="mb-4 rounded-xl p-3 text-xs space-y-2" style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}>
              <p className="text-blue-300 font-semibold">Required format:</p>
              <code className="block text-blue-200 font-mono bg-black/20 rounded px-2 py-1 text-[11px]">name,image_url,price,category</code>
              <p className="text-white/30 text-[11px]">Category keys: {CATEGORY_OPTIONS.map(c => c.key).join(", ")}</p>
            </div>
          )}

          <div
            className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition hover:border-white/20"
            style={{ borderColor: "rgba(255,255,255,0.08)" }}
            onClick={() => fileRef.current?.click()}
          >
            <p className="text-3xl mb-2">📄</p>
            <p className="text-white/40 text-xs">Drop CSV here or <span className="text-orange-400 underline">browse</span></p>
            <p className="text-white/20 text-[11px] mt-1">.csv files only</p>
            <input ref={fileRef} type="file" accept=".csv" onChange={importCsv} className="hidden" disabled={csvLoading} />
          </div>
          {csvLoading && <p className="mt-2 text-xs text-white/40">Importing…</p>}
          {csvMsg && (
            <p className={`mt-2 text-xs font-medium ${csvMsg.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{csvMsg}</p>
          )}
        </div>

        {/* Seed */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h3 className="text-white font-semibold text-sm mb-1">Seed Full Menu</h3>
          <p className="text-white/25 text-xs mb-4">One-click import of all 67 dishes across 9 categories. Safe to run multiple times.</p>
          <button onClick={seedItems} disabled={seeding} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition" style={{ background: "#0d9488" }}>
            {seeding ? "Seeding…" : "Seed All Items"}
          </button>
          {seedMsg && (
            <p className={`mt-2 text-xs ${seedMsg.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{seedMsg}</p>
          )}
        </div>
      </div>

      {/* ── Right: menu table ── */}
      <div className="lg:col-span-3">
        <div
          className="rounded-2xl p-5"
          style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold text-sm">Current Menu</h3>
            <p className="text-white/25 text-xs">{activeCount} active items</p>
          </div>

          {loading ? (
            <p className="text-white/25 text-sm text-center py-12">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-white/25 text-sm text-center py-12">No items yet. Add one or seed the menu.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-white/25">Dish</th>
                    <th className="pb-3 pr-4 text-left text-[11px] font-semibold uppercase tracking-wider text-white/25">Price</th>
                    <th className="pb-3 text-left text-[11px] font-semibold uppercase tracking-wider text-white/25">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) =>
                    editId === item.id ? (
                      /* ── Inline edit ── */
                      <tr key={item.id} className="border-b border-white/5">
                        <td colSpan={3} className="py-3">
                          <div className="rounded-xl p-4" style={{ background: "rgba(224,92,42,0.07)", border: "1px solid rgba(224,92,42,0.18)" }}>
                            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wide mb-3">Editing: {item.name}</p>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <div>
                                <label className="text-white/25 text-[11px] mb-1 block">Name</label>
                                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className={dinp} />
                              </div>
                              <div>
                                <label className="text-white/25 text-[11px] mb-1 block">Price ($)</label>
                                <input type="number" step="0.01" min="0" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className={dinp} />
                              </div>
                              <div>
                                <label className="text-white/25 text-[11px] mb-1 block">Category</label>
                                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className={dinp} style={{ colorScheme: "dark" }}>
                                  <option value="" style={{ background: "#111827" }}>No category</option>
                                  {CATEGORY_OPTIONS.map((c) => <option key={c.key} value={c.key} style={{ background: "#111827" }}>{c.label}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-white/25 text-[11px] mb-1 block">Image URL</label>
                                <input value={editForm.image_url} onChange={(e) => setEditForm({ ...editForm, image_url: e.target.value })} className={dinp} />
                              </div>
                            </div>
                            {editForm.image_url && (
                              <div className="flex items-center gap-3 mb-3">
                                <img
                                  src={editForm.image_url} alt="preview"
                                  className="w-14 h-10 object-cover rounded-lg"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                />
                                <p className="text-white/20 text-xs">Preview</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <button onClick={saveEdit} disabled={saving} className="rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-50" style={{ background: "#e05c2a" }}>
                                {saving ? "Saving…" : "Save changes"}
                              </button>
                              <button onClick={() => setEditId(null)} className="rounded-lg px-4 py-2 text-xs text-white/40 border border-white/10 hover:bg-white/5 transition">
                                Cancel
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      /* ── Normal row ── */
                      <tr
                        key={item.id}
                        className={`border-b border-white/5 transition-colors hover:bg-white/2 ${item.active ? "" : "opacity-40"}`}
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url} alt=""
                                className="w-9 h-9 rounded-lg object-cover shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                              />
                            )}
                            <div className="min-w-0">
                              <p className="text-white font-semibold text-sm truncate leading-tight">{item.name}</p>
                              {item.category && (
                                <span className="text-[10px] font-medium" style={{ color: CATEGORY_COLORS[item.category] ?? "#888" }}>
                                  {catLabel(item.category)}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-bold text-sm" style={{ color: "#f97316" }}>${Number(item.price).toFixed(2)}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                              style={
                                item.active
                                  ? { background: "rgba(16,185,129,0.15)", color: "#10b981" }
                                  : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)" }
                              }
                            >
                              {item.active ? "ACTIVE" : "DISABLED"}
                            </span>
                            <button onClick={() => startEdit(item)} className="text-orange-400 hover:text-orange-300 text-xs font-semibold transition">Edit</button>
                            <button onClick={() => toggleActive(item)} className="text-blue-400 hover:text-blue-300 text-xs transition">{item.active ? "Hide" : "Show"}</button>
                            <button onClick={() => deleteItem(item.id, item.name)} className="text-red-400/50 hover:text-red-400 text-xs transition">Del</button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [tab,         setTab]         = useState<"orders" | "menu">("orders");
  const [orders,      setOrders]      = useState<Order[]>([]);
  const [menuItems,   setMenuItems]   = useState<MenuItem[]>([]);
  const [loadOrders,  setLoadOrders]  = useState(true);
  const [loadMenu,    setLoadMenu]    = useState(true);
  const [updatingId,  setUpdatingId]  = useState<string | null>(null);

  // ── Fetch orders (polls every 5s)
  useEffect(() => {
    let alive = true;
    async function fetchOrders() {
      const res = await fetch("/api/admin/orders");
      if (res.ok && alive) { setOrders(await res.json()); }
      if (alive) setLoadOrders(false);
    }
    fetchOrders();
    const id = setInterval(fetchOrders, 5000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  // ── Fetch menu (on demand)
  async function fetchMenu() {
    const res = await fetch("/api/admin/menu");
    if (res.ok) setMenuItems(await res.json());
    setLoadMenu(false);
  }
  useEffect(() => { fetchMenu(); }, []); // eslint-disable-line

  // ── Stats (derived)
  const today = new Date().toDateString();
  const stats = {
    pending:    orders.filter(o => o.status === "PENDING").length,
    preparing:  orders.filter(o => o.status === "PREPARING").length,
    readyToday: orders.filter(o => o.status === "READY" && new Date(o.created_at).toDateString() === today).length,
    menuItems:  menuItems.filter(i => i.active).length,
  };

  // ── Advance order status
  async function advanceOrder(order: Order) {
    const next = STATUS_CONFIG[order.status].next;
    if (!next) return;
    setUpdatingId(order.id);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setUpdatingId(null);
    // Refresh orders immediately
    const res = await fetch("/api/admin/orders");
    if (res.ok) setOrders(await res.json());
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const STATS_BAR = [
    { label: "PENDING",     value: stats.pending,    color: "#f59e0b" },
    { label: "PREPARING",   value: stats.preparing,  color: "#818cf8" },
    { label: "READY TODAY", value: stats.readyToday, color: "#10b981" },
    { label: "MENU ITEMS",  value: stats.menuItems,  color: "#f97316" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#080d14" }}>

      {/* ── Header ── */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: "#0e1520", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🦞</span>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Salty&apos;s Seafood</h1>
            <p className="text-white/25 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-sm font-medium px-4 py-2 rounded-xl transition"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}
        >
          Sign Out
        </button>
      </div>

      {/* ── Stats bar ── */}
      <div
        className="grid grid-cols-4"
        style={{ background: "#0e1520", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {STATS_BAR.map((s, i) => (
          <div
            key={s.label}
            className="py-5 px-4 text-center"
            style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
          >
            <p className="text-3xl font-extrabold leading-none mb-1" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div
        className="px-6 flex gap-0"
        style={{ background: "#0e1520", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {(["orders", "menu"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="relative px-5 py-4 text-sm font-semibold transition-colors"
            style={{ color: tab === t ? "#fff" : "rgba(255,255,255,0.28)" }}
          >
            {t === "orders" ? "📋 Orders" : "🍽 Menu"}
            {tab === t && (
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: "#e05c2a" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {tab === "orders" ? (
          <OrdersTab
            orders={orders}
            loading={loadOrders}
            updatingId={updatingId}
            onAdvance={advanceOrder}
          />
        ) : (
          <MenuTab
            items={menuItems}
            loading={loadMenu}
            onRefresh={fetchMenu}
          />
        )}
      </div>

      {/* Live indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
        </span>
        <span className="text-white/25 text-[10px]">live</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authState, setAuthState] = useState<"loading" | "unauthenticated" | "authenticated">("loading");

  useEffect(() => {
    fetch("/api/admin/check")
      .then((r) => setAuthState(r.ok ? "authenticated" : "unauthenticated"))
      .catch(() => setAuthState("unauthenticated"));
  }, []);

  if (authState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080d14" }}>
        <p className="text-white/20 text-sm">Loading…</p>
      </div>
    );
  }

  return authState === "authenticated"
    ? <Dashboard />
    : <LoginForm onLogin={() => setAuthState("authenticated")} />;
}
