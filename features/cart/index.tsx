
"use client";

import React, {useMemo} from 'react';
import { useRouter } from 'next/navigation'

import {toast} from "react-hot-toast";

import {getItemTotal} from "@/utils/cartUtils";


import {formatNumberWithDots} from "@/lib/formatNumberWithDots";

import {Button} from "@/components/ui/button";
import {useCartStore} from "@/stores/cartStore";
import {saveOrder} from "@/lib/api/saveOrder";

const CartPageContent = () => {
    const router = useRouter();


    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);

    const total = useMemo(
        () => items.reduce((sum, item) => sum + getItemTotal(item), 0).toFixed(2),
        [items]
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
            <h1 className="text-3xl font-bold mb-6">🛒 Cart</h1>
            {items.length === 0 ? (
                <p className="text-muted-foreground">No items in cart</p>
            ) : (
                <div className="space-y-4">
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="border p-4 rounded-md flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">{item.name}</p>
                                <p className="text-muted-foreground">
                                    Size: {item.size}ml | Qty: {item.quantity}
                                </p>
                            </div>
                            <p className="font-semibold">${formatNumberWithDots(Number(getItemTotal(item)))}</p>
                        </div>
                    ))}

                    <div className="text-xl font-bold text-right">Total: ${formatNumberWithDots(Number(total))}</div>

                    <div className="flex justify-between mt-6">
                        <Button variant="outline" onClick={clearCart}>
                            Clear
                        </Button>
                        <Button onClick={handleFinish}>Finish and Send via WhatsApp</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPageContent;