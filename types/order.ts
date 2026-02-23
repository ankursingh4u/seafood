export type OrderStatus = "PENDING" | "PREPARING" | "READY";

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customer_name: string;
  phone: string;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  dish_id: string;
  name: string;
  price: number;
  qty: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  customer_name: string;
  phone: string;
  notes?: string;
}
