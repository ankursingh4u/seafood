"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CartItem } from "@/types/menu";

const CART_KEY = "saltys_cart";

function getCart(): CartItem[] {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => { setCart(getCart()); }, []);

  function updateQty(dish_id: string, delta: number) {
    const updated = cart
      .map((c) => c.dish_id === dish_id ? { ...c, qty: c.qty + delta } : c)
      .filter((c) => c.qty > 0);
    setCart(updated);
    saveCart(updated);
  }

  function remove(dish_id: string) {
    const updated = cart.filter((c) => c.dish_id !== dish_id);
    setCart(updated);
    saveCart(updated);
  }

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

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
            <h1 className="text-white font-extrabold text-2xl">Your Cart</h1>
            {totalItems > 0 && (
              <p className="text-white/40 text-xs">{totalItems} items selected</p>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-36">
        {cart.length === 0 ? (
          <div className="text-center py-24">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl"
              style={{ background: "#f0e8dc" }}
            >
              🛒
            </div>
            <p className="text-gray-700 font-bold mb-1 text-lg">Cart is empty</p>
            <p className="text-gray-400 text-sm mb-7">Add your favourite seafood items</p>
            <Link
              href="/menu"
              className="text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition"
              style={{ background: "#e05c2a" }}
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-5">
              {cart.map((item) => (
                <div
                  key={item.dish_id}
                  className="bg-white rounded-2xl px-4 py-4 flex items-center gap-4"
                  style={{ border: "1px solid #f0e8dc", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="font-extrabold text-sm mt-0.5" style={{ color: "#1a8a4a" }}>
                      ${item.price}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div
                      className="flex items-center gap-1.5 rounded-xl px-2 py-1.5"
                      style={{ background: "#fff4ef", border: "1px solid #f9d4c4" }}
                    >
                      <button
                        onClick={() => updateQty(item.dish_id, -1)}
                        className="w-7 h-7 rounded-lg bg-white font-bold flex items-center justify-center"
                        style={{ color: "#e05c2a", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                      >
                        −
                      </button>
                      <span
                        className="w-5 text-center font-extrabold text-sm"
                        style={{ color: "#e05c2a" }}
                      >
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.dish_id, 1)}
                        className="w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center"
                        style={{ background: "#e05c2a" }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.dish_id)}
                      className="text-gray-300 hover:text-red-400 transition text-xl ml-1"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill */}
            <div
              className="bg-white rounded-2xl p-5"
              style={{ border: "1px solid #f0e8dc", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <h3 className="font-bold text-gray-800 text-sm mb-4 pb-3 border-b border-gray-100">
                Bill Details
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
                <span className="font-bold text-gray-900">To Pay</span>
                <span className="font-extrabold text-xl" style={{ color: "#e05c2a" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      {cart.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 px-4 py-4"
          style={{ background: "white", borderTop: "1px solid #f0e8dc" }}
        >
          <div className="max-w-lg mx-auto">
            <Link
              href="/checkout"
              className="flex items-center justify-between text-white px-5 py-4 rounded-2xl transition"
              style={{ background: "#e05c2a", boxShadow: "0 4px 20px rgba(224,92,42,0.35)" }}
            >
              <span className="font-bold text-sm">Proceed to Checkout</span>
              <span className="font-extrabold">${total.toFixed(2)} →</span>
            </Link>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
