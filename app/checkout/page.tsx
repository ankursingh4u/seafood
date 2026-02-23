"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CartItem } from "@/types/menu";

const CART_KEY = "saltys_cart";

function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({ customer_name: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const c = getCart();
    if (c.length === 0) { router.replace("/menu"); return; }
    setCart(c);
  }, [router]);

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_name: form.customer_name.trim(),
        phone: form.phone.trim(),
        notes: form.notes.trim() || undefined,
        items: cart,
      }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      localStorage.removeItem(CART_KEY);
      router.push(`/success?order_id=${data.order_id}`);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong. Please try again.");
    }
  }

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-gray-400 transition";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fdf9f4" }}>
      <SiteHeader />

      {/* Page header */}
      <div style={{ background: "#0d1f2d" }} className="border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-5 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-white/50 hover:text-white transition text-lg"
          >
            ←
          </button>
          <div>
            <h1 className="text-white font-extrabold text-2xl">Checkout</h1>
            <p className="text-white/40 text-xs">{totalItems} items · ${total.toFixed(2)} total</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-10">

        {/* Order Summary */}
        <div
          className="bg-white rounded-2xl p-5 mb-4"
          style={{ border: "1px solid #f0e8dc", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <h3 className="font-bold text-gray-800 text-sm mb-3 pb-3 border-b border-gray-100">
            Order Summary
          </h3>
          <div className="space-y-2.5">
            {cart.map((item) => (
              <div key={item.dish_id} className="flex justify-between text-sm">
                <span className="text-gray-500">{item.name} × {item.qty}</span>
                <span className="font-semibold text-gray-700">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-xl" style={{ color: "#e05c2a" }}>
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Form */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: "1px solid #f0e8dc", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
        >
          <h3 className="font-bold text-gray-800 text-sm mb-4">Your Details</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={form.customer_name}
                onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                required
                className={inputClass}
                style={{ border: "1.5px solid #e5e7eb" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className={inputClass}
                style={{ border: "1.5px solid #e5e7eb" }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">
                Special Instructions
                <span className="text-gray-300 font-normal normal-case ml-1">(optional)</span>
              </label>
              <textarea
                placeholder="e.g. Extra spicy, less oil, no onions..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className={`${inputClass} resize-none`}
                style={{ border: "1.5px solid #e5e7eb" }}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-4 rounded-2xl text-sm font-bold transition disabled:opacity-60"
              style={{
                background: loading ? "#aaa" : "#e05c2a",
                boxShadow: "0 4px 20px rgba(224,92,42,0.3)",
              }}
            >
              {loading ? "Placing Order..." : `Place Order · $${total.toFixed(2)}`}
            </button>

            <p className="text-center text-xs text-gray-400">
              This is a pickup order. We&apos;ll prepare it fresh for you.
            </p>
          </form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
