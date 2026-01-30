"use client";

import { useState } from "react";

import { Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Order } from "@/utils/order-utils";

import ShippingForm from "./shipping-form";

interface ShippingDialogProps {
  order: Order;
  onSuccess?: () => void;
}

export default function ShippingDialog({
  order,
  onSuccess,
}: ShippingDialogProps) {
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
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Información de envío</DialogTitle>
          <DialogDescription>Orden #{order.order_code}</DialogDescription>
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
