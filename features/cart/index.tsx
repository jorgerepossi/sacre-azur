"use client";

import React, { useMemo } from "react";
import Image from 'next/image'
import { useRouter } from "next/navigation";

import { useCartStore } from "@/stores/cartStore";
import { toast } from "react-hot-toast";

import { Button, buttonVariants } from "@/components/ui/button";

import { saveOrder } from "@/lib/api/saveOrder";
import { formatNumberWithDots } from "@/lib/formatNumberWithDots";

import { getItemTotal } from "@/utils/cartUtils";
import Flex from "@/components/flex";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrashIcon, ShoppingCart } from "lucide-react";



const CartPageContent = () => {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + getItemTotal(item), 0).toFixed(2),
    [items],
  );

  const handleFinish = async () => {
    try {
      const order = items.map((item) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }));

      const order_code = await saveOrder(order);

      clearCart();

      router.push(`/order-confirmed?code=${order_code}`);
    } catch (err) {
      toast.error("Error saving order");
      console.error("SaveOrder failed", err);
    }
  };

  return (
    <div className="container py-10">
      <Flex className={'items-center py-[2rem] gap-3'}>  <ShoppingCart />
      <h1 className=" m-0 text-3xl font-bold"> Cart</h1>
      </Flex>
      {items.length === 0 ? (
        <Flex className={'flex-col space-y-4'}>
          <p className="text-muted-foreground">No items in cart</p>
         <Flex>
           <Link href={'/'} type={'button'} className={cn( buttonVariants({ variant: 'default' }) )}>  Volver al Home</Link>
         </Flex>
        </Flex>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-md border-t pt-4"
            >
              <Flex className={'justify-center items-center'} >
                <Flex className={'w-[60px] h-[60px]'}>

                <Image src={item.image} alt={item.name} width={80} height={80} />
                </Flex>
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-muted-foreground m-0">
                   Tamaño: {item.size}ml |
                  </p>
                  <p className="text-muted-foreground m-0">
                    Cantidad: {item.quantity}
                  </p>
                </div>
              </Flex>
              <p className="font-semibold">
                ${formatNumberWithDots(Number(getItemTotal(item)))}
              </p>
            </div>
          ))}

          <div className="text-right text-xl font-bold">
            Total: ${formatNumberWithDots(Number(total))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={clearCart} className={'flex items-center justify-center gap-2'}>
             <TrashIcon size={16} /> Vaciar Carrito
            </Button>
            <Button onClick={handleFinish}>Finalizar y enviar via WhatsApp</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPageContent;
