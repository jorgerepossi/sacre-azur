import { Perfume } from "@/types/perfume.type";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    profit_margin?: number;
    quantity: number;
    size: number;
    image: string;
}

export interface GetTotal {
    name: string
    size: number
    quantity: number
    total: number
}