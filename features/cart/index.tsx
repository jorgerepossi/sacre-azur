"use client";

import React, { useMemo, useState } from "react";
import Image from 'next/image'
import { useRouter } from "@/hooks/useTenantRouter";

import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-hot-toast";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { saveOrder } from "@/lib/api/saveOrder";
import { formatNumberWithDots } from "@/lib/formatNumberWithDots";

import { getItemTotal } from "@/utils/cartUtils";
import Flex from "@/components/flex";
import { Link } from "@/components/link";
import { cn } from "@/lib/utils";
import { TrashIcon, ShoppingCart, Plus, Minus } from "lucide-react";
import { useTenant } from "@/providers/TenantProvider";

const CartPageContent = () => {
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
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }));

      const order_code = await saveOrder(order, customerName, customerPhone);

      // Enviar WhatsApp automáticamente al dueño
      if (tenant?.whatsapp_number) {
        const orderDetails = items
          .map(item => `• ${item.name} - ${item.size}ml x${item.quantity} = $${formatNumberWithDots(Number(getItemTotal(item)))}`)
          .join('\n');
        
        const msg = encodeURIComponent(
          `🛍️ ¡Nuevo pedido recibido!\n\n` +
          `👤 Cliente: ${customerName}\n` +
          `📱 Teléfono: ${customerPhone}\n\n` +
          `🔐 Código: ${order_code}\n\n` +
          `📦 Productos:\n${orderDetails}\n\n` +
          `💰 Total: $${formatNumberWithDots(Number(total))}\n\n` +
          `🔗 Ver y confirmar: ${window.location.origin}/${tenant.slug}/order-confirmed?code=${order_code}&view=admin`
        );
console.log('Tenant WhatsApp:', tenant.whatsapp_number);
console.log('Mensaje:', msg);

const cleanNumber = tenant.whatsapp_number.replace(/[^0-9]/g, '');
// Abrir WhatsApp
window.open(`https://wa.me/${cleanNumber}?text=${msg}`, '_blank');

      }

      clearCart();

      // Llevar al cliente a su vista
      router.push(`/order-confirmed?code=${order_code}&view=client`);
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

  return (
    <div className="container py-10">
      <Flex className={'items-center py-[2rem] gap-3'}>  
        <ShoppingCart />
        <h1 className="m-0 text-3xl font-bold">Carrito</h1>
      </Flex>
      
      {items.length === 0 ? (
        <Flex className={'flex-col space-y-4'}>
          <p className="text-muted-foreground">No hay productos en el carrito</p>
          <Flex>
            <Link href={'/'} className={cn(buttonVariants({ variant: 'default' }))}>
              Volver al Home
            </Link>
          </Flex>
        </Flex>
      ) : !showCheckout ? (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border-t pt-4"
            >
              <Flex className={'justify-center items-center gap-4'}>
                <Flex className={'w-[60px] h-[60px]'}>
                  <Image src={item.image} alt={item.name} width={80} height={80} />
                </Flex>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-muted-foreground m-0">
                    Tamaño: {item.size}ml
                  </p>
                  <Flex className={'items-center gap-2 mt-2'}>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDecrement(item)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleIncrement(item)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Flex>
                </div>
              </Flex>
              <p className="font-semibold">
                ${formatNumberWithDots(Number(getItemTotal(item)))}
              </p>
            </div>
          ))}

          <div className="text-right text-xl font-bold border-t pt-4">
            Total: ${formatNumberWithDots(Number(total))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={clearCart} className={'flex items-center justify-center gap-2'}>
              <TrashIcon size={16} /> Vaciar Carrito
            </Button>
            <Button onClick={() => setShowCheckout(true)}>
              Continuar con el pedido
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setShowCheckout(false)}
            className="mb-4"
          >
            ← Volver al carrito
          </Button>

          <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            <div className="space-y-2 text-sm">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name} ({item.size}ml) x{item.quantity}</span>
                  <span>${formatNumberWithDots(Number(getItemTotal(item)))}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>${formatNumberWithDots(Number(total))}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleFinish} className="space-y-4">
            <h2 className="text-xl font-bold">Datos de contacto</h2>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo *</Label>
              <Input
                id="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono / WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+54 9 11 1234-5678"
                required
              />
              <p className="text-xs text-muted-foreground">
                Te contactaremos por WhatsApp para confirmar tu pedido
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Enviando..." : "Finalizar y enviar pedido"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CartPageContent;