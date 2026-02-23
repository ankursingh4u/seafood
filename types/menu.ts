export interface MenuItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
  active: boolean;
  created_at: string;
  category?: string;
}

export interface CartItem {
  dish_id: string;
  name: string;
  price: number;
  qty: number;
}
