import { Perfume } from "@/types/perfume.type";

export interface CartItem {
  id: string;
  name: string;
  price: number; // precio unitario calculado con margen
  quantity: number;
  size: number;
  image: string;
  profit_margin: number;
}
export interface GetTotal {
  name: string;
  size: number;
  quantity: number;
  total: number;
}
