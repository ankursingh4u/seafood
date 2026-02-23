"use client";

import Image from "next/image";
import { useState } from "react";
import { MenuItem } from "@/types/menu";
import { addToCart } from "@/lib/cart";

interface Props {
  items: MenuItem[];
}

function DishCard({ item }: { item: MenuItem }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart({ dish_id: item.id, name: item.name, price: item.price });
    window.dispatchEvent(new Event("cart-updated"));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
      <div className="relative h-48 w-full bg-stone-100">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-800 text-base leading-snug mb-1">{item.name}</h3>
        <p className="text-teal-700 font-semibold text-sm mb-4">${item.price.toFixed(2)}</p>
        <button
          onClick={handleAdd}
          className={`mt-auto w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            added
              ? "bg-green-500 text-white"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

export default function MenuGrid({ items }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <DishCard key={item.id} item={item} />
      ))}
    </div>
  );
}
