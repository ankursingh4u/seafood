"use client";

// ─────────────────────────────────────────────────────────────────────────────
// app/admin/orders/page.tsx — Orders Dashboard (Dev C builds this)
//
// WHAT THIS PAGE DOES:
//   Shows all incoming orders in real-time. The owner can see each order's
//   items, customer info, and update the status (PENDING → PREPARING → READY).
//
// WHAT IS ALREADY DONE FOR YOU (Dev B built these):
//   ✓ GET  /api/admin/orders         — fetch all orders (newest first)
//   ✓ PATCH /api/admin/orders/[id]   — update status
//   ✓ Auth check (cookie-based) — already wired in both APIs
//   ✓ Supabase Realtime set up — orders table broadcasts on INSERT/UPDATE
//   ✓ Order type: see types/order.ts
//
// WHAT YOU (Dev C) NEED TO BUILD HERE:
//   1. On page load: fetch GET /api/admin/orders and show the list
//   2. Subscribe to Supabase Realtime so new orders appear automatically
//      (see docs/dev-c.md for the exact subscription code)
//   3. For each order: show customer name, phone, items, total, status badge
//   4. Add buttons to advance status: PENDING → PREPARING → READY
//      Call PATCH /api/admin/orders/[id] with { status: "PREPARING" } etc.
//   5. Show a "no orders yet" empty state
//
// AUTH NOTE:
//   This page is under /admin so the admin cookie is already set.
//   Both APIs (/api/admin/orders and /api/admin/orders/[id]) verify it.
//   You do NOT need to handle auth yourself here — just fetch the APIs.
//
// QUICK START — see docs/dev-c.md for:
//   - Full Supabase Realtime subscription code snippet
//   - Order type definition
//   - Status badge color guide (PENDING=yellow, PREPARING=blue, READY=green)
//   - Recommended UI structure
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/types/order";

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // TODO (Dev C): Replace this initial fetch with real data
  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // TODO (Dev C): Add Supabase Realtime subscription here
  // See docs/dev-c.md for the exact code snippet.

  // TODO (Dev C): Replace this stub UI with your real orders UI
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders Dashboard</h1>
          <p className="text-xs text-gray-400">{orders.length} orders loaded</p>
        </div>
        <Link href="/admin" className="text-sm text-gray-400 hover:text-gray-600 transition">
          ← Menu Management
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <p className="text-gray-400 text-sm">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
            <p className="text-gray-400 text-sm">No orders yet.</p>
            <p className="text-gray-300 text-xs mt-1">New orders will appear here in real-time.</p>
          </div>
        ) : (
          // TODO (Dev C): Replace with your styled order cards
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {/* TODO (Dev C): Replace with a proper status badge + update buttons */}
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      {order.status}
                    </span>
                    <p className="text-sm font-bold text-gray-900 mt-2">${order.total}</p>
                  </div>
                </div>
                {/* TODO (Dev C): Show order.items list here */}
                {order.notes && (
                  <p className="text-xs text-gray-500 mt-3 border-t pt-3">Note: {order.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
