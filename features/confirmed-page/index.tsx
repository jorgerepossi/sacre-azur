"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import Flex from "@/components/flex";
import SmallLoader from "@/components/loaders/small";
import { Button } from "@/components/ui/button";

import { formatNumberWithDots } from "@/lib/formatNumberWithDots";
import { supabase } from "@/lib/supabaseClient";
import { useTenant } from "@/providers/TenantProvider";

export default function OrderConfirmedPage() {
  const params = useSearchParams();
  const orderCode = params.get("code");
  const { tenant } = useTenant();

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
    if (!order || !tenant) return;

    const msg = encodeURIComponent(
      `✅  ¡Nuevo pedido recibido!\n\n🔐 Código de pedido: ${order.order_code}\n\n🔗Detalles:\n${window.location.origin}/order-confirmed?code=${order.order_code}`,
    );

    const waUrl = `https://wa.me/${tenant.whatsapp_number}?text=${msg}`;

    window.open(waUrl, "_blank");

    await supabase
      .from("orders")
      .update({ is_sent: true })
      .eq("order_code", order.order_code);

    setHasSent(true);
  };

  if (loading)
    return (
      <Flex className={"container h-full items-center justify-center p-[2rem]"}>
        {" "}
        <SmallLoader />{" "}
      </Flex>
    );
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const total = order?.order_products?.reduce(
    (sum: number, item: any) =>
      sum + Number(item?.price || 0) * Number(item?.quantity || 0),
    0,
  );

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">
        {hasSent ? "✅ Pedido Confirmado" : "Confirmar Pedido"}
      </h1>
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
            className="flex items-center justify-between rounded-md border p-4"
          >
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-muted-foreground">
                Size: {item.size}ml | Qty: {item.quantity}
              </p>
            </div>
            <div className="mt-4 text-right text-xl font-bold">
              Total: $
              {formatNumberWithDots(
                Number(item.price || 0) * Number(item.quantity || 0),
              )}
            </div>
          </div>
        ))}

        <div className="mt-4 text-right text-xl font-bold">
          Total: ${formatNumberWithDots(total)}
        </div>

        {!hasSent && (
          <div className="mt-6 text-center">
            <Button className="mt-6" onClick={handleSend}>
              Enviar pedido por WhatsApp
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
