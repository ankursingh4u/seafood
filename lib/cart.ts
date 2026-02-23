import { CartItem } from "@/types/menu";

const CART_KEY = "cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.cart) ? parsed.cart : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify({ cart: items }));
}

export function addToCart(item: Omit<CartItem, "qty">): void {
  const items = getCart();
  const existing = items.find((i) => i.dish_id === item.dish_id);
  if (existing) {
    existing.qty += 1;
  } else {
    items.push({ ...item, qty: 1 });
  }
  saveCart(items);
}

export function updateQty(dish_id: string, qty: number): void {
  let items = getCart();
  if (qty <= 0) {
    items = items.filter((i) => i.dish_id !== dish_id);
  } else {
    const item = items.find((i) => i.dish_id === dish_id);
    if (item) item.qty = qty;
  }
  saveCart(items);
}

export function removeFromCart(dish_id: string): void {
  const items = getCart().filter((i) => i.dish_id !== dish_id);
  saveCart(items);
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify({ cart: [] }));
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}
