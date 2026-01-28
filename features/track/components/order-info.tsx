interface OrderInfoProps {
  order: any;
}

export default function OrderInfo({ order }: OrderInfoProps) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Información del pedido</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Código:</span>
          <span className="font-mono font-semibold">{order.order_code}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fecha:</span>
          <span>{new Date(order.created_at).toLocaleDateString('es-AR')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Cliente:</span>
          <span>{order.customer_name}</span>
        </div>
      </div>
    </div>
  );
}