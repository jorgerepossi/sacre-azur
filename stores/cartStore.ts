import { create } from "zustand";
import { Perfume } from "@/types/perfume.type";

export type CartItem = {
    perfume: Perfume;
    quantity: number;
    size: number;
    total: number;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
};

export const useCart = create<CartStore>((set) => ({
    items: [],

    addItem: (newItem) =>
        set((state) => {
            const existingIndex = state.items.findIndex(
                (item) =>
                    item.perfume.id === newItem.perfume.id &&
                    item.size === newItem.size
            );

            if (existingIndex !== -1) {
                // Actualizar cantidad y total si ya existe el item con ese tamaño
                const updatedItems = [...state.items];
                const existingItem = updatedItems[existingIndex];

                updatedItems[existingIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + newItem.quantity,
                    total: existingItem.total + newItem.total,
                };

                return { items: updatedItems };
            }
            
            return { items: [...state.items, newItem] };
        }),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.perfume.id !== id),
        })),

    clearCart: () => set({ items: [] }),
}));