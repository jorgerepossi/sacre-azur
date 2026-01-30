"use client";

import { useEffect, useState } from "react";

import { useSearchParams } from "next/navigation";

import { useTenant } from "@/providers/TenantProvider";

import Flex from "@/components/flex";
import SmallLoader from "@/components/loaders/small";
import { Button } from "@/components/ui/button";

import { formatNumberWithDots } from "@/lib/formatNumberWithDots";
import { supabase } from "@/lib/supabaseClient";

export default function OrderConfirmedPage() {
  const params = useSearchParams();
  const orderCode = params.get("code");
  const view = params.get("view");

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  // Auto-abrir WhatsApp en NUEVA PESTAÑA cuando el cliente llega
  useEffect(() => {
    if (view === "client") {
      const pendingWhatsapp = localStorage.getItem("whatsapp_pending");
      if (pendingWhatsapp) {
        setWhatsappUrl(pendingWhatsapp);
        // Abrir en NUEVA PESTAÑA
        window.open(pendingWhatsapp, "_blank");
        // Limpiar localStorage
        localStorage.removeItem("whatsapp_pending");
      }
    }
  }, [view]);

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
      .update({
        is_confirmed: true,
        status: "CONFIRMADO", // <-- ACTUALIZAR ESTADO TAMBIÉN
      })
      .eq("order_code", order.order_code);

    setIsConfirmed(true);

    // Enviar WhatsApp al cliente en NUEVA PESTAÑA
    if (order.customer_phone) {
      const customerPhone = order.customer_phone.replace(/[^0-9]/g, "");

      const msg = encodeURIComponent(
        `✅ ¡Hola ${order.customer_name}!\n\n` +
          `Tu pedido ha sido confirmado.\n\n` +
          `Código de pedido: ${order.order_code}\n\n` +
          `Pronto nos pondremos en contacto contigo para coordinar la entrega.\n\n` +
          `¡Gracias por tu compra! 🎉`,
      );

      window.open(`https://wa.me/${customerPhone}?text=${msg}`, "_blank");
    }
  };

  const handleResendWhatsapp = () => {
    if (whatsappUrl) {
      window.open(whatsappUrl, "_blank"); // <-- NUEVA PESTAÑA
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
  if (view === "client") {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-4 text-6xl">✅</div>
          <h1 className="mb-4 text-3xl font-bold">¡Pedido recibido!</h1>

          <div className="mb-6 rounded-lg border-2 border-green-500 bg-green-50 p-6">
            <p className="mb-4 text-lg font-semibold text-green-900">
              📱 Último paso importante
            </p>
            <p className="mb-4 text-sm text-green-800">
              Se abrió WhatsApp en una nueva pestaña con tu pedido. Si no se
              abrió, hacé clic aquí:
            </p>
            {whatsappUrl && (
              <Button
                onClick={handleResendWhatsapp}
                size="lg"
                className="w-full bg-green-600 py-6 text-lg text-white hover:bg-green-700"
              >
                📱 Abrir WhatsApp y enviar pedido
              </Button>
            )}
          </div>

          <p className="mb-6 text-muted-foreground">
            Código de pedido: <strong>{order.order_code}</strong>
          </p>

          <div className="mb-6 rounded-lg bg-muted p-6">
            <h3 className="mb-4 font-semibold">Resumen del pedido</h3>
            <div className="space-y-2 text-left text-sm">
              {order.order_products.map((item: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <span>
                    {item.name} ({item.size}ml) x{item.quantity}
                  </span>
                  <span>
                    $
                    {formatNumberWithDots(
                      Number(item.price || 0) * Number(item.quantity || 0),
                    )}
                  </span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-2 font-bold">
                <span>Total:</span>
                <span>${formatNumberWithDots(total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="mb-2 font-semibold">¿Qué pasa después?</p>
            <ol className="space-y-1 text-left">
              <li>1. Enviás el mensaje de WhatsApp</li>
              <li>2. El vendedor confirma tu pedido</li>
              <li>3. Coordinan el pago y envío</li>
            </ol>
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

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Código de pedido</p>
          <p className="font-bold">{order.order_code}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Cliente</p>
          <p className="font-bold">{order.customer_name}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Teléfono</p>
          <p className="font-bold">{order.customer_phone}</p>
        </div>
        {order.order_email && (
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-bold">{order.order_email}</p>
          </div>
        )}
      </div>

      <h2 className="mb-4 text-xl font-bold">Productos</h2>
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
              $
              {formatNumberWithDots(
                Number(item.price || 0) * Number(item.quantity || 0),
              )}
            </div>
          </div>
        ))}

        <div className="mt-4 border-t pt-4 text-right text-xl font-bold">
          Total: ${formatNumberWithDots(total)}
        </div>

        {!isConfirmed && (
          <div className="mt-6 text-center">
            <Button className="mt-6" onClick={handleConfirm} size="lg">
              ✓ Confirmar recepción y notificar al cliente
            </Button>
            <p className="mt-2 text-sm text-muted-foreground">
              Se enviará un WhatsApp automático al cliente confirmando el pedido
            </p>
          </div>
        )}

        {isConfirmed && (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-center text-green-800">
            <p className="font-semibold">✅ Pedido confirmado correctamente</p>
            <p className="mt-1 text-sm">
              El cliente fue notificado por WhatsApp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
