import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-900 to-slate-800 flex items-center justify-center px-4">
      <div className="text-center text-white">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-4">
          Saltys Seafood & Takeaway
        </h1>
        <p className="text-xl sm:text-2xl text-teal-200 mb-10 font-light">
          Fresh. Fast. Pickup.
        </p>
        <Link
          href="/menu"
          className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg px-10 py-4 rounded-full transition-colors shadow-lg"
        >
          Order &amp; Pick Up
        </Link>
      </div>
    </main>
  );
}
