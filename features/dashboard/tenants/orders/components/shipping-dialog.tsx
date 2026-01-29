"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";
import ShippingForm from "./shipping-form";
import { Order } from "@/utils/order-utils";
import { useState } from "react";

interface ShippingDialogProps {
  order: Order;
  onSuccess?: () => void;
}

export default function ShippingDialog({ order, onSuccess }: ShippingDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Truck className="h-4 w-4" />
          {order.order_shipping ? "Editar envío" : "Agregar envío"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Información de envío</DialogTitle>
          <DialogDescription>
            Orden #{order.order_code}
          </DialogDescription>
        </DialogHeader>
        <ShippingForm
          orderId={order.id}
          existingShipping={order.order_shipping}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}