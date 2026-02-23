"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/cart";

export default function Navbar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(getCartCount());

    const refresh = () => setCount(getCartCount());

    window.addEventListener("storage", refresh);
    window.addEventListener("cart-updated", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("cart-updated", refresh);
    };
  }, []);

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight hover:text-amber-400 transition-colors">
          Saltys Seafood
        </Link>
        <Link href="/cart" className="relative flex items-center gap-1 hover:text-amber-400 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {count > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
