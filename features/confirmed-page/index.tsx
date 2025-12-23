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
  const view = params.get("view");
  const { tenant } = useTenant();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

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
        setIsConfirmed(data.is_confirmed || false);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderCode]);

  const handleConfirm = async () => {
    if (!order) return;

    await supabase
      .from("orders")
      .update({ is_confirmed: true })
      .eq("order_code", order.order_code);

    setIsConfirmed(true);

    // Enviar WhatsApp al cliente
    if (order.customer_phone) {
      const customerPhone = order.customer_phone.replace(/[^0-9]/g, ''); // Limpiar formato
      
      const msg = encodeURIComponent(
        `✅ ¡Hola ${order.customer_name}!\n\n` +
        `Tu pedido ha sido confirmado.\n\n` +
        `Código de pedido: ${order.order_code}\n\n` +
        `Pronto nos pondremos en contacto contigo para coordinar la entrega.\n\n` +
        `¡Gracias por tu compra! 🎉`
      );

      window.open(`https://wa.me/${customerPhone}?text=${msg}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Flex className={"container h-full items-center justify-center p-[2rem]"}>
        <SmallLoader />
      </Flex>
    );
  }

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const total = order?.order_products?.reduce(
    (sum: number, item: any) =>
      sum + Number(item?.price || 0) * Number(item?.quantity || 0),
    0,
  );

  // VISTA DEL CLIENTE
  if (view === 'client') {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-4">¡Pedido Enviado!</h1>
          <p className="text-muted-foreground mb-2">
            Tu pedido ha sido enviado exitosamente al vendedor.
          </p>
          <p className="text-muted-foreground mb-6">
            Código de pedido: <strong>{order.order_code}</strong>
          </p>
          
          <div className="bg-muted p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-4">Resumen del pedido</h3>
            <div className="space-y-2 text-sm text-left">
              {order.order_products.map((item: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name} ({item.size}ml) x{item.quantity}</span>
                  <span>${formatNumberWithDots(Number(item.price || 0) * Number(item.quantity || 0))}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>${formatNumberWithDots(total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              📱 Recibirás una confirmación por WhatsApp en breve
            </p>
          </div>
        </div>
      </div>
    );
  }

  // VISTA DEL ADMIN
  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">
        {isConfirmed ? "✅ Pedido Confirmado" : "📦 Nuevo Pedido"}
      </h1>
      
      <div className="grid gap-4 mb-6 md:grid-cols-2">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Código de pedido</p>
          <p className="font-bold">{order.order_code}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Cliente</p>
          <p className="font-bold">{order.customer_name}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Teléfono</p>
          <p className="font-bold">{order.customer_phone}</p>
        </div>
        {order.order_email && (
          <div className="border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-bold">{order.order_email}</p>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Productos</h2>
      <div className="space-y-4">
        {order.order_products.map((item: any, i: number) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-md border p-4"
          >
            <div>
              <p className="font-bold">{item.name}</p>
              <p className="text-muted-foreground">
                Tamaño: {item.size}ml | Cantidad: {item.quantity}
              </p>
            </div>
            <div className="text-right font-bold">
              ${formatNumberWithDots(Number(item.price || 0) * Number(item.quantity || 0))}
            </div>
          </div>
        ))}

        <div className="mt-4 text-right text-xl font-bold border-t pt-4">
          Total: ${formatNumberWithDots(total)}
        </div>

        {!isConfirmed && (
          <div className="mt-6 text-center">
            <Button className="mt-6" onClick={handleConfirm} size="lg">
              ✓ Confirmar recepción y notificar al cliente
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Se enviará un WhatsApp automático al cliente confirmando el pedido
            </p>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-6 text-center p-4 bg-green-100 text-green-800 rounded-lg">
            <p className="font-semibold">✅ Pedido confirmado correctamente</p>
            <p className="text-sm mt-1">El cliente fue notificado por WhatsApp</p>
          </div>
        )}
      </div>
    </div>
  );
}