import { Metadata } from "next";

import CartPageContent from "@/features/cart";

export const metadata: Metadata = {
  title: "Carrito de Compras | Tu Tienda de Perfumes",
  description: "Revisa y completa tu compra de perfumes seleccionados",
};

export default function CartPage() {
  return <CartPageContent />;
}
