import { create } from "zustand";

type CartItem = {
    id: string;
    name: string;
    quantity: number;
    price: number;
    size: string;
};

type CartStore = {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
    items: [],
    addItem: (item) => {
        const existing = get().items.find(
            (i) => i.id === item.id && i.size === item.size
        );
        if (existing) {
            set({
                items: get().items.map((i) =>
                    i.id === item.id && i.size === item.size
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                ),
            });
        } else {
            set({ items: [...get().items, item] });
        }
    },
    removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
    },
    clearCart: () => set({ items: [] }),
}));
