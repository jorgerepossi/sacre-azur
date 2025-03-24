
import { create } from "zustand";
import { Perfume } from "@/types/perfume.type";

type CartItem = {
    perfume: Perfume;
    size: number;
    quantity: number;
    total: number;
};

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    addItem: (item) =>
        set((state) => ({
            items: [...state.items, item],
        })),
    clearCart: () => set({ items: [] }),
}));
