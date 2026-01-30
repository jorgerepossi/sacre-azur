import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CartItem } from "@/types/cartItem";

type CartItemType = Pick<
  CartItem,
  "id" | "name" | "size" | "price" | "quantity" | "image"
>;

type CartStore = {
  items: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (id: string, size: number) => void;
  updateQuantity: (id: string, size: number, quantity: number) => void;
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
      removeItem: (id, size) => {
        set({
          items: get().items.filter((i) => !(i.id === id && i.size === size)),
        });
      },
      updateQuantity: (id, size, quantity) => {
        set({
          items: get().items.map((i) =>
            i.id === id && i.size === size ? { ...i, quantity } : i,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
