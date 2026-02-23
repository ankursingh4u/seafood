"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import { CartItem } from "@/types/menu";
import { CreateOrderPayload } from "@/types/order";
import { getCart } from "@/lib/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; api?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cart = getCart();
    if (cart.length === 0) {
      router.replace("/menu");
      return;
    }
    setItems(cart);
  }, [router]);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Customer name is required.";
    if (!phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\d{7,15}$/.test(phone.replace(/[\s\-\(\)]/g, ""))) {
      errs.phone = "Enter a valid phone number (digits only).";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    const payload: CreateOrderPayload = {
      items: items.map(({ dish_id, name, price, qty }) => ({ dish_id, name, price, qty })),
      customer_name: name.trim(),
      phone: phone.trim(),
      notes: notes.trim() || undefined,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrors({ api: body?.error ?? `Order failed (${res.status}). Please try again.` });
        return;
      }

      const { order_id } = await res.json();
      router.push("/success?order_id=" + encodeURIComponent(order_id));
    } catch {
      setErrors({ api: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

        {/* Order summary */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 mb-8">
          <h2 className="font-semibold text-slate-700 mb-4">Order Summary</h2>
          <div className="divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.dish_id} className="flex justify-between py-2 text-sm text-slate-700">
                <span>
                  {item.name} × {item.qty}
                </span>
                <span className="font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-stone-100 font-semibold text-slate-800">
            <span>Total</span>
            <span className="text-teal-700">${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="bg-white rounded-xl shadow-sm border border-stone-100 p-6 space-y-5">
          <h2 className="font-semibold text-slate-700">Your Details</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="customer-name">
              Customer Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="phone">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g. 0412 345 678"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="notes">
              Notes <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Any special requests?"
            />
          </div>

          {errors.api && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {errors.api}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            )}
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
