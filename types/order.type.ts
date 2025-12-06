import { Product } from "@/utils/order-utils";

export type OrderProduct = {
  product_id: string;
  quantity: number;
  price: number;
};

export type OrderType = {
  id: string;
  order_code: string;
  order_email: string;
  order_products: OrderProduct[];
  created_at: string;
};

export type Order = {
  id: string;
  order_code: string;
  created_at: string;
  is_sent: boolean;
  order_email: string;
  order_products: Product[];
  tenant_id: string;
};
