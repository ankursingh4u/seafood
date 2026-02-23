import Navbar from "@/app/components/Navbar";
import MenuGrid from "./MenuGrid";
import { MenuItem } from "@/types/menu";

async function getMenuItems(): Promise<{ items: MenuItem[] | null; error: string | null }> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/menu`, { cache: "no-store" });
    if (!res.ok) {
      return { items: null, error: `Menu unavailable (${res.status})` };
    }
    const data: MenuItem[] = await res.json();
    return { items: data, error: null };
  } catch {
    return { items: null, error: "Could not connect to menu service." };
  }
}

export default async function MenuPage() {
  const { items, error } = await getMenuItems();

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Our Menu</h1>
        {error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-2xl mb-2">🐟</p>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Menu Unavailable</h2>
            <p className="text-slate-500">{error}</p>
            <p className="text-slate-400 text-sm mt-1">Please try again shortly.</p>
          </div>
        ) : (
          <MenuGrid items={items!} />
        )}
      </div>
    </div>
  );
}
