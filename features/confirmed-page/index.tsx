"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatNumberWithDots } from "@/lib/formatNumberWithDots";
import { Button } from "@/components/ui/button";

export default function OrderConfirmedPage() {
    const params = useSearchParams();
    const orderCode = params.get("code");

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasSent, setHasSent] = useState(false); // 👈 Estado nuevo

    useEffect(() => {
        if (!orderCode) {
            setError("Order code is missing.");
            setLoading(false);
            return;
        }

        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from("orders")
                .select("*")
                .eq("order_code", orderCode)
                .single();

            if (error || !data) {
                setError("Order not found.");
            } else {
                setOrder(data);
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderCode]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    const total = order?.order_products?.reduce(
        (sum: number, item: any) =>
            sum + Number(item?.price || 0) * Number(item?.quantity || 0),
        0
    );

    const handleSend = () => {
        const msg = encodeURIComponent(
            `✅ ¡Gracias por tu compra!\n\n🔐 Código de pedido: ${order.order_code}\n\n🔗 Revisá tu pedido:\n${window.location.origin}/order-confirmed?code=${order.order_code}`
        );

        const phone = process.env.NEXT_PUBLIC_SITE_PHONE;
        window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");

        setHasSent(true);
    };

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">✅ Pedido Confirmado</h1>
            <p className="mb-2 text-muted-foreground">
                Código de pedido: <strong>{order.order_code}</strong>
            </p>
            <p className="mb-6 text-muted-foreground">
                Correo: <strong>{order.order_email}</strong>
            </p>

            <div className="space-y-4">
                {order.order_products.map((item: any, i: number) => (
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
                        <p className="font-semibold">
                            ${formatNumberWithDots(item.price * item.quantity)}
                        </p>
                    </div>
                ))}

                <div className="text-xl font-bold text-right mt-4">
                    Total: ${formatNumberWithDots(total)}
                </div>

                {!hasSent && (
                    <div className="text-center mt-6">
                        <Button className="mt-6" onClick={handleSend}>
                            Enviar pedido por WhatsApp
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
