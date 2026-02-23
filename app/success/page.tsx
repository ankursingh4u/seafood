"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import { clearCart } from "@/lib/cart";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id") ?? "";

  useEffect(() => {
    clearCart();
    window.dispatchEvent(new Event("cart-updated"));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-bold text-slate-800 mb-3">Order Placed!</h1>
      {orderId && (
        <span className="inline-block bg-teal-100 text-teal-800 font-semibold text-sm px-4 py-1.5 rounded-full mb-6">
          #{`ORD-${orderId}`}
        </span>
      )}
      <p className="text-slate-600 max-w-sm mb-10">
        Your order is being prepared. Please come to the counter to collect.
      </p>
      <Link
        href="/menu"
        className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-full transition-colors"
      >
        Order More
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4">
        <Suspense fallback={<div className="py-24 text-center text-slate-500">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
