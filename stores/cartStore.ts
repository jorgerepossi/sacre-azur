import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CartItem } from "@/types/cartItem";


type CartItemType = Pick< CartItem,  'id'|  'name' | 'size' | 'price' | 'quantity'> ;


type CartStore = {
  items: CartItemType[];
  addItem: (item: CartItemType) => void; // or using CartItem
  removeItem: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.size === item.size,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.size === item.size
                ? { ...i, quantity: i.quantity + item.quantity }
                : i,
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
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
