"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { formatNumberWithDots } from "@/lib/formatNumberWithDots";
import { Button } from "@/components/ui/button";
import SmallLoader from "@/components/loaders/small";
import Flex from "@/components/flex";

export default function OrderConfirmedPage() {
    const params = useSearchParams();
    const orderCode = params.get("code");

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasSent, setHasSent] = useState(false);

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
                setHasSent(data.is_sent);
            }
            setLoading(false);
        };

        fetchOrder();
    }, [orderCode]);

    const handleSend = async () => {
        if (!order) return;

        const msg = encodeURIComponent(
            `✅  ¡Nuevo pedido recibido!\n\n🔐 Código de pedido: ${order.order_code}\n\n🔗Detalles:\n${window.location.origin}/order-confirmed?code=${order.order_code}`
        );

        const phone = process.env.NEXT_PUBLIC_SITE_PHONE;
        const waUrl = `https://wa.me/${phone}?text=${msg}`;

        window.open(waUrl, "_blank");


        await supabase
            .from("orders")
            .update({ is_sent: true })
            .eq("order_code", order.order_code);

        setHasSent(true);
    };

    if (loading) return <Flex className={'container p-[2rem] justify-center items-center h-full'}> <SmallLoader /> </Flex>;
    if (error) return <p className="p-6 text-red-500">{error}</p>;

    const total = order?.order_products?.reduce(
        (sum: number, item: any) =>
            sum + Number(item?.price || 0) * Number(item?.quantity || 0),
        0
    );

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-6">{hasSent ? '✅ Pedido Confirmado' : 'Confirmar Pedido'}</h1>
            <p className="mb-2 text-muted-foreground">Código de pedido: <strong>{order.order_code}</strong></p>
            <p className="mb-6 text-muted-foreground">Correo: <strong>{order.order_email}</strong></p>

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
                        <div className="text-xl font-bold text-right mt-4">
                            Total: ${formatNumberWithDots(Number(item.price || 0) * Number(item.quantity || 0))}
                        </div>
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
