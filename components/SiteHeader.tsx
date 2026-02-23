"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { CartItem } from "@/types/menu";

const CART_KEY = "saltys_cart";

export default function SiteHeader() {
  const pathname = usePathname();
  const isHome   = pathname === "/";

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen,  setMenuOpen]  = useState(false);
  // Start scrolled=true on non-home pages so effect never needs to set state immediately
  const [scrolled,  setScrolled]  = useState(() => pathname !== "/");

  // Cart count — poll localStorage
  useEffect(() => {
    function read() {
      const cart: CartItem[] = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      setCartCount(cart.reduce((s, c) => s + c.qty, 0));
    }
    read();
    const id = setInterval(read, 300);
    return () => clearInterval(id);
  }, []);

  // Transparent ↔ solid on home page; keep solid on all other pages
  useEffect(() => {
    if (!isHome) {
      setScrolled(true); // no-op on first render (already true), handles client nav
      return;
    }
    function onScroll() { setScrolled(window.scrollY > 55); }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  const linkClass = (href: string) =>
    `text-sm font-medium transition-all px-3 py-1.5 rounded-lg ${
      pathname === href
        ? "text-amber-400"
        : "text-white/80 hover:text-white hover:bg-white/10"
    }`;

  return (
    <header
      className={isHome ? "fixed top-0 left-0 right-0 z-50" : "sticky top-0 z-50"}
      style={{
        background:    transparent ? "transparent"        : "rgba(10,20,30,0.96)",
        backdropFilter: transparent ? "none"              : "blur(14px)",
        borderBottom:  transparent ? "1px solid transparent" : "1px solid rgba(255,255,255,0.08)",
        transition:    "background 0.45s ease, backdrop-filter 0.45s ease, border-color 0.45s ease",
      }}
    >
      <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div
            style={{
              width: 68, height: 42,
              background: "transparent",
              border: `1.5px solid ${transparent ? "rgba(245,158,11,0.6)" : "rgba(245,158,11,0.45)"}`,
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "logoFloat 3.2s ease-in-out infinite",
              flexShrink: 0,
              transition: "border-color 0.4s ease",
            }}
          >
            <span style={{ fontFamily: "var(--font-dancing), cursive", fontSize: "1.2rem", color: "#fff", lineHeight: 1, userSelect: "none" }}>
              Salty&apos;s
            </span>
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: "rgba(245,158,11,0.65)" }}>
              Seafood &amp; Takeaway
            </div>
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/"    className={linkClass("/")}>Home</Link>
          <Link href="/menu" className={linkClass("/menu")}>Menu</Link>
          <Link
            href="/cart"
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition ${
              pathname === "/cart" ? "bg-amber-500 text-white" : "bg-orange-600 hover:bg-orange-500 text-white"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            Cart
            {cartCount > 0 && (
              <span className="bg-white text-orange-600 text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

        {/* ── Mobile: cart + hamburger ── */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link href="/cart" className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-xl text-sm font-semibold transition">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 19a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z" />
            </svg>
            {cartCount > 0 && (
              <span className="bg-white text-orange-600 text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white/80 hover:text-white p-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1" style={{ background: "rgba(10,20,30,0.98)" }}>
          <Link href="/"     onClick={() => setMenuOpen(false)} className={linkClass("/")}>Home</Link>
          <Link href="/menu" onClick={() => setMenuOpen(false)} className={linkClass("/menu")}>Menu</Link>
        </div>
      )}
    </header>
  );
}
