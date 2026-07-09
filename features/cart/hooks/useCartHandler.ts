import React, { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { useTenant } from "@/providers/TenantProvider";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-hot-toast";

import { saveOrder } from "@/lib/api/saveOrder";
import { formatNumberWithDots } from "@/lib/formatNumberWithDots";

import { getItemTotal } from "@/utils/cartUtils";

export const useCartHandler = () => {
  const router = useRouter();
  const { tenant } = useTenant();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + getItemTotal(item), 0).toFixed(2),
    [items],
  );

  const handleFinish = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim() || !customerPhone.trim()) {
      toast.error("Por favor completá todos los datos");
      return;
    }

    setLoading(true);

    try {
      const order = items.map((item) => ({
        id: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
      }));

      const order_code = await saveOrder(
        order,
        tenant!.slug,
        customerName,
        customerPhone,
      );

      clearCart();

      if (tenant?.whatsapp_number) {
        const orderDetails = items
          .map(
            (item) =>
              `• ${item.name} - ${item.size}ml x${item.quantity} = $${formatNumberWithDots(Number(getItemTotal(item)))}`,
          )
          .join("\n");

        const msg = encodeURIComponent(
          `Hola! Quiero hacer un pedido:\n\n` +
            `👤 ${customerName}\n` +
            `📱 ${customerPhone}\n\n` +
            `📦 Productos:\n${orderDetails}\n\n` +
            `💰 Total: $${formatNumberWithDots(Number(total))}\n\n` +
            `Código de pedido: ${order_code}`,
        );

        const cleanNumber = tenant.whatsapp_number.replace(/[^0-9]/g, "");

        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${msg}`;
        localStorage.setItem("whatsapp_pending", whatsappUrl);
      }

      // Redirigir a página de confirmación
      router.push(`/${tenant?.slug}/order-confirmed?code=${order_code}&view=client`);
    } catch (err) {
      toast.error("Error al guardar el pedido");
      console.error("SaveOrder failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = (item: any) => {
    updateQuantity(item.id, item.size, item.quantity + 1);
  };

  const handleDecrement = (item: any) => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.size, item.quantity - 1);
    } else {
      removeItem(item.id, item.size);
    }
  };

  return {
    showCheckout,
    setShowCheckout,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    clearCart,
    loading,
    items,
    total,
    removeItem,
    handleFinish,
    handleIncrement,
    handleDecrement,
  };
};
