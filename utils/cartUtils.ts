import { CartItem } from "@/types/cartItem";

export const getItemTotal = (item: any): number => {
  const base = item.price;
  const margin = item.profit_margin ?? 0;
  const finalPrice = base + (base * margin) / 100;
  return finalPrice * item.quantity;
};
