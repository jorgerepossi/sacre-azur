import { OrderStatus } from "./tracking-status";

export const getNotificationMessage = (
  status: OrderStatus,
  customerName: string,
  orderCode: string,
  trackingUrl: string
): string => {
  const messages = {
    CONFIRMADO: 
      `✅ ¡Hola ${customerName}!\n\n` +
      `Tu pedido ha sido confirmado y estamos preparándolo.\n\n` +
      `📦 Código: ${orderCode}\n\n` +
      `Pronto nos pondremos en contacto para coordinar la entrega.\n\n` +
      `🔍 Seguí tu pedido: ${trackingUrl}\n\n` +
      `¡Gracias por tu compra! 🎉`,

    ENVIADO:
      `🚚 ¡Hola ${customerName}!\n\n` +
      `Tu pedido está en camino.\n\n` +
      `📦 Código: ${orderCode}\n\n` +
      `Te contactaremos cuando esté cerca de llegar.\n\n` +
      `🔍 Seguí tu pedido: ${trackingUrl}`,

    COMPLETADO:
      `🎉 ¡Hola ${customerName}!\n\n` +
      `Tu pedido fue entregado exitosamente.\n\n` +
      `📦 Código: ${orderCode}\n\n` +
      `Esperamos que disfrutes tu compra. ¡Gracias por confiar en nosotros!`,

    CANCELADO:
      `❌ Hola ${customerName},\n\n` +
      `Lamentablemente tu pedido fue cancelado.\n\n` +
      `📦 Código: ${orderCode}\n\n` +
      `Si tenés alguna duda, no dudes en contactarnos.`,
  };

  return messages[status as keyof typeof messages] || "";
};

export const openWhatsApp = (phone: string, message: string) => {
  const cleanNumber = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/${cleanNumber}?text=${encodedMessage}`, '_blank');
};