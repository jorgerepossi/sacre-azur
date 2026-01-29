import { OrderShipping } from "@/types/order-shipping.type";
import { format } from "date-fns";

export interface Product {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

export type Status = 'PENDIENTE' | 'CONFIRMADO' | 'ENVIADO' | 'COMPLETADO' | 'CANCELADO';

export interface Order {
  id: string;
  order_code: string;
  created_at: string;
  order_email: string;
  customer_name?: string;
  customer_phone?: string;
  order_products: Product[];
  is_sent: boolean;
  is_confirmed?: boolean;  
  status: Status  
  updated_at?: string; 
  order_shipping?: OrderShipping;
}
export interface SortConfig {
  key: keyof Order | null;
  direction: "ascending" | "descending";
}

export const formatPrice = (price: number) => {
  return `$${price.toLocaleString("es-AR")}`;
};

export const calculateOrderTotal = (products: Product[]) => {
  return products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
};

export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "MMM dd, yyyy HH:mm");
};

export const sortOrders = (orders: Order[], sortConfig: SortConfig) => {
  if (!orders) return [];

  return [...orders].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (sortConfig.key === "created_at") {
      return sortConfig.direction === "ascending"
        ? new Date(aValue as string).getTime() -
            new Date(bValue as string).getTime()
        : new Date(bValue as string).getTime() -
            new Date(aValue as string).getTime();
    }

    if (typeof aValue === "boolean" && typeof bValue === "boolean") {
      return sortConfig.direction === "ascending"
        ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
        : (bValue ? 1 : 0) - (aValue ? 1 : 0);
    }

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortConfig.direction === "ascending"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });
};

export const filterOrders = (orders: Order[], searchTerm: string) => {
  if (!orders) return [];
  if (!searchTerm) return orders;

  const searchLower = searchTerm.toLowerCase();
  return orders.filter(
    (order) =>
      order.order_code.toLowerCase().includes(searchLower) ||
      order.order_email?.toLowerCase().includes(searchLower) ||
      order.order_products.some((product) =>
        product.name.toLowerCase().includes(searchLower),
      ),
  );
};
