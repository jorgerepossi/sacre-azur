"use client";

import React, { useMemo, useState } from "react";

import Image from "next/image";

import { useTenant } from "@/providers/TenantProvider";
import { useCartStore } from "@/stores/cartStore";
import { Minus, Plus, ShoppingCart, TrashIcon } from "lucide-react";
import { toast } from "react-hot-toast";

import Flex from "@/components/flex";
import { Link } from "@/components/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRouter } from "@/hooks/useTenantRouter";

import { saveOrder } from "@/lib/api/saveOrder";
import { formatNumberWithDots } from "@/lib/formatNumberWithDots";
import { cn } from "@/lib/utils";

import { getItemTotal } from "@/utils/cartUtils";

import { useCartHandler } from "./hooks/useCartHandler";

const CartPageContent = () => {
  const {
    items,
    total,
    handleIncrement,
    handleDecrement,
    clearCart,
    showCheckout,
    setShowCheckout,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    handleFinish,
    loading,
  } = useCartHandler();
  return (
    <div className="container py-10">
      <Flex className={"items-center gap-3 py-[2rem]"}>
        <ShoppingCart />
        <h1 className="m-0 text-3xl font-bold">Carrito</h1>
      </Flex>

      {items.length === 0 ? (
        <Flex className={"flex-col space-y-4"}>
          <p className="text-muted-foreground">
            No hay productos en el carrito
          </p>
          <Flex>
            <Link
              href={"/"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
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
              <Flex className={"items-center justify-center gap-4"}>
                <Flex className={"h-[60px] w-[60px]"}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                  />
                </Flex>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="m-0 text-muted-foreground">
                    Tamaño: {item.size}ml
                  </p>
                  <Flex className={"mt-2 items-center gap-2"}>
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

          <div className="border-t pt-4 text-right text-xl font-bold">
            Total: ${formatNumberWithDots(Number(total))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={clearCart}
              className={"flex items-center justify-center gap-2"}
            >
              <TrashIcon size={16} /> Vaciar Carrito
            </Button>
            <Button onClick={() => setShowCheckout(true)}>
              Continuar con el pedido
            </Button>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-md">
          <Button
            variant="ghost"
            onClick={() => setShowCheckout(false)}
            className="mb-4"
          >
            ← Volver al carrito
          </Button>

          <div className="mb-6 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-bold">Resumen del pedido</h2>
            <div className="space-y-2 text-sm">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.name} ({item.size}ml) x{item.quantity}
                  </span>
                  <span>
                    ${formatNumberWithDots(Number(getItemTotal(item)))}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-bold">
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
              {loading ? "Enviando..." : "Finalizar pedido"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CartPageContent;
