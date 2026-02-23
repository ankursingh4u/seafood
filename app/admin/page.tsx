"use client";

import { useState, useEffect, useRef } from "react";

interface MenuItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
  active: boolean;
}

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      onLogin();
    } else {
      setError("Wrong password. Try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm border">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Saltys Admin</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to manage your menu and orders</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white rounded-xl px-4 py-3 text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", image_url: "", price: "" });
  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);
  const [csvMsg, setCsvMsg] = useState("");
  const [csvLoading, setCsvLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadItems() {
    const res = await fetch("/api/admin/menu");
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadItems(); }, []);

  async function toggleActive(item: MenuItem) {
    await fetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });
    loadItems();
  }

  async function deleteItem(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/menu/${id}`, { method: "DELETE" });
    loadItems();
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setAdding(true);
    const res = await fetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setAdding(false);
    if (res.ok) {
      setForm({ name: "", image_url: "", price: "" });
      loadItems();
    } else {
      const d = await res.json();
      setFormError(d.error || "Failed to add item");
    }
  }

  async function importCsv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvLoading(true);
    setCsvMsg("");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/menu-import", { method: "POST", body: formData });
    const data = await res.json();
    setCsvLoading(false);
    if (res.ok) {
      setCsvMsg(`✓ Imported ${data.imported} items, deactivated ${data.deactivated}`);
      loadItems();
    } else {
      setCsvMsg(`✗ ${data.error}`);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const activeCount = items.filter((i) => i.active).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Saltys Admin</h1>
          <p className="text-xs text-gray-400">{activeCount} active items on menu</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-red-500 transition"
        >
          Logout
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Add Dish */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Add New Dish</h2>
          <form onSubmit={addItem} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                placeholder="Dish name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                placeholder="Image URL *"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
              <input
                type="number"
                placeholder="Price ₹ *"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
                min={0}
                step={0.01}
              />
            </div>
            {formError && <p className="text-red-500 text-sm">{formError}</p>}
            <button
              type="submit"
              disabled={adding}
              className="bg-orange-500 text-white rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition"
            >
              {adding ? "Adding..." : "Add Dish"}
            </button>
          </form>
        </div>

        {/* CSV Import */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Import from CSV / Google Sheet</h2>
          <p className="text-sm text-gray-500 mb-4">
            Export your Google Sheet as CSV and upload here. Format:{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">name,image_url,price</code>
            {" "}— existing dishes are updated, dishes not in file are hidden.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl px-5 py-2.5 text-sm font-medium transition">
              {csvLoading ? "Importing..." : "Choose CSV file"}
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={importCsv}
                className="hidden"
                disabled={csvLoading}
              />
            </label>
            {csvMsg && (
              <span className={`text-sm font-medium ${csvMsg.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>
                {csvMsg}
              </span>
            )}
          </div>
        </div>

        {/* Menu Table */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Menu Items
            <span className="ml-2 text-xs font-normal text-gray-400">
              {items.length} total · {activeCount} visible
            </span>
          </h2>

          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-gray-400 text-sm">No items yet. Add one above or import a CSV.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 text-xs border-b">
                    <th className="pb-3 font-medium w-14">Image</th>
                    <th className="pb-3 font-medium">Dish Name</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className={item.active ? "" : "opacity-40"}>
                      <td className="py-3">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-12 h-10 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://placehold.co/48x40?text=?";
                          }}
                        />
                      </td>
                      <td className="py-3 font-medium text-gray-900">{item.name}</td>
                      <td className="py-3 text-gray-700">₹{item.price}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            item.active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {item.active ? "Visible" : "Hidden"}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-4">
                          <button
                            onClick={() => toggleActive(item)}
                            className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                          >
                            {item.active ? "Hide" : "Show"}
                          </button>
                          <button
                            onClick={() => deleteItem(item.id, item.name)}
                            className="text-red-400 hover:text-red-600 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (authState === "unauthenticated") {
    return <LoginForm onLogin={() => setAuthState("authenticated")} />;
  }

  return <Dashboard />;
}
