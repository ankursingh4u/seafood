"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import { CartItem } from "@/types/menu";
import { getCart, updateQty, removeFromCart } from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const refresh = () => setItems(getCart());

  const dispatchUpdate = () => {
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleUpdateQty = (dish_id: string, qty: number) => {
    updateQty(dish_id, qty);
    refresh();
    dispatchUpdate();
  };

  const handleRemove = (dish_id: string) => {
    removeFromCart(dish_id);
    refresh();
    dispatchUpdate();
  };

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🛒</p>
            <p className="text-lg text-slate-600 mb-6">Your cart is empty.</p>
            <Link
              href="/menu"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-stone-100 divide-y divide-stone-100">
              {items.map((item) => (
                <div key={item.dish_id} className="flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-teal-700 font-semibold text-sm">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateQty(item.dish_id, item.qty - 1)}
                      className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-slate-600 hover:bg-stone-100 transition-colors font-bold"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-slate-800">{item.qty}</span>
                    <button
                      onClick={() => handleUpdateQty(item.dish_id, item.qty + 1)}
                      className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center text-slate-600 hover:bg-stone-100 transition-colors font-bold"
                    >
                      +
                    </button>
                  </div>
                  <p className="w-20 text-right font-semibold text-slate-800">
                    ${(item.price * item.qty).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemove(item.dish_id)}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-lg font-semibold text-slate-800">
                Total: <span className="text-teal-700">${total.toFixed(2)}</span>
              </p>
              <Link
                href="/checkout"
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
              >
                Checkout →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
