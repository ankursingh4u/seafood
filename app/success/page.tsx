"use client";

import { Suspense, useEffect, useState, Fragment } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { OrderStatus } from "@/types/order";

const STEPS: { status: OrderStatus; label: string; icon: string }[] = [
  { status: "PENDING",   label: "Confirmed",  icon: "✓"  },
  { status: "PREPARING", label: "Preparing",  icon: "🍳" },
  { status: "READY",     label: "Ready",      icon: "✓"  },
];

function statusToStep(s: OrderStatus): number {
  return s === "PENDING" ? 0 : s === "PREPARING" ? 1 : 2;
}

const MSG: Record<OrderStatus, string> = {
  PENDING:   "Your order is confirmed! We'll start preparing it shortly.",
  PREPARING: "We're cooking your order fresh right now — almost there!",
  READY:     "Your order is ready for pickup! Come collect it hot 🔥",
};

function SuccessContent() {
  const params   = useSearchParams();
  const orderId  = params.get("order_id");
  const [status, setStatus]   = useState<OrderStatus>("PENDING");
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    let stopped = false;

    async function poll() {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (!stopped) {
            setStatus(data.status as OrderStatus);
            if (data.status === "READY") { setPolling(false); stopped = true; }
          }
        }
      } catch { /* ignore */ }
    }

    poll();
    const id = setInterval(poll, 5000);
    return () => { stopped = true; clearInterval(id); };
  }, [orderId]);

  const currentStep = statusToStep(status);

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div
        className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center"
        style={{ border: "1px solid #f0e8dc", boxShadow: "0 8px 40px rgba(0,0,0,0.06)" }}
      >
        {/* Icon */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl"
          style={{ background: "linear-gradient(135deg, #0d1f2d, #1a3a50)" }}
        >
          {status === "READY" ? "🎊" : "🎉"}
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          {status === "READY" ? "Order Ready!" : "Order Placed!"}
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{MSG[status]}</p>

        {/* Order reference */}
        {orderId && (
          <div
            className="rounded-2xl px-4 py-3 mb-6 text-left"
            style={{ background: "#fdf9f4", border: "1px solid #f0e8dc" }}
          >
            <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Order Reference</p>
            <p className="text-xs font-mono text-gray-600 break-all leading-relaxed">{orderId}</p>
          </div>
        )}

        {/* ── Status stepper ── */}
        <div className="flex items-center mb-6 px-1">
          {STEPS.map((step, i) => {
            const active = i <= currentStep;
            const lineActive = i < currentStep;
            return (
              <Fragment key={step.status}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500"
                    style={{
                      background: active ? "#e05c2a" : "#fdf9f4",
                      border:     active ? "none"     : "2px solid #f0e8dc",
                      color:      active ? "#fff"     : "#d1d5db",
                      boxShadow:  active && i === currentStep ? "0 0 0 4px rgba(224,92,42,0.15)" : "none",
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="text-[11px] font-semibold transition-colors duration-500 whitespace-nowrap"
                    style={{ color: active ? "#e05c2a" : "#9ca3af" }}
                  >
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mb-5 mx-1 transition-all duration-700"
                    style={{ background: lineActive ? "#e05c2a" : "#f0e8dc" }}
                  />
                )}
              </Fragment>
            );
          })}
        </div>

        {/* Live update indicator */}
        {polling && (
          <div className="flex items-center justify-center gap-2 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <p className="text-xs text-gray-400">Live updates · refreshes automatically</p>
          </div>
        )}

        <Link
          href="/menu"
          className="block w-full text-white py-4 rounded-2xl text-sm font-bold transition mb-3"
          style={{ background: "#e05c2a", boxShadow: "0 4px 20px rgba(224,92,42,0.3)" }}
        >
          Order More
        </Link>
        <Link href="/" className="block text-sm font-medium text-gray-400 hover:text-gray-700 transition">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fdf9f4" }}>
      <SiteHeader />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
