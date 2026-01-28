"use client";

import React, { useState } from "react";

import { CheckCircle2, ChevronDown, ChevronUp, Clock, MessageCircle, Package, Truck, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  calculateOrderTotal,
  formatDate,
  formatPrice,
  Status,
  type Order,
} from "@/utils/order-utils";

import ProductsTable from "./products-table";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import { getNotificationMessage, openWhatsApp } from "@/lib/whatsapp-notifications";
import { useTenant } from "@/providers/TenantProvider";

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const STATUS_CONFIG = {
  PENDIENTE: {
    label: "Pendiente",
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: Clock,
  },
  CONFIRMADO: {
    label: "Confirmado",
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    icon: CheckCircle2,
  },
  ENVIADO: {
    label: "Enviado",
    color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    icon: Truck,
  },
  COMPLETADO: {
    label: "Completado",
    color: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: Package,
  },
  CANCELADO: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 hover:bg-red-100",
    icon: XCircle,
  },
};
 
const NOTIFIABLE_STATUSES = ['CONFIRMADO', 'ENVIADO', 'COMPLETADO', 'CANCELADO'];

export default function OrderRow({
  order,
  isExpanded,
  onToggleExpand,
}: OrderRowProps) {
  const { tenant } = useTenant();
  const [status, setStatus] = useState(order.status || "PENDIENTE");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: Status) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", order.id);

      if (error) throw error;

      setStatus(newStatus);
      toast.success(`Estado actualizado a ${STATUS_CONFIG[newStatus as keyof typeof STATUS_CONFIG].label}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error al actualizar el estado");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleNotifyCustomer = () => {
    if (!order.customer_phone) {
      toast.error("No hay teléfono del cliente");
      return;
    }

    if (!NOTIFIABLE_STATUSES.includes(status)) {
      toast.error("Este estado no requiere notificación");
      return;
    }

    const trackingUrl = `${window.location.origin}/${tenant?.slug}/track?code=${order.order_code}`;
    const message = getNotificationMessage(
      status as any,
      order.customer_name || "Cliente",
      order.order_code,
      trackingUrl
    );

    openWhatsApp(order.customer_phone, message);
    toast.success("WhatsApp abierto - Enviá el mensaje al cliente");
  };

  const StatusIcon = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG]?.icon || Clock;
  const statusConfig = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDIENTE;

  const canNotify = NOTIFIABLE_STATUSES.includes(status) && order.customer_phone;

  return (
    <React.Fragment>
      <TableRow className="cursor-pointer hover:bg-muted/50">
        <TableCell onClick={onToggleExpand}>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </TableCell>
        <TableCell className="font-medium" onClick={onToggleExpand}>
          {order.order_code}
        </TableCell>
        <TableCell onClick={onToggleExpand}>
          {formatDate(order.created_at)}
        </TableCell>
        <TableCell onClick={onToggleExpand}>
          {order.customer_name}
        </TableCell>
        <TableCell onClick={onToggleExpand}>{order.customer_phone}</TableCell>
        <TableCell onClick={onToggleExpand}>
          {order.order_products.length}{" "}
          {order.order_products.length === 1 ? "item" : "items"}
        </TableCell>
        <TableCell className="text-right" onClick={onToggleExpand}>
          {formatPrice(calculateOrderTotal(order.order_products))}
        </TableCell>
        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
          <Select
            value={status}
            onValueChange={handleStatusChange}
            disabled={isUpdating}
          >
            <SelectTrigger className={`w-[140px] ${statusConfig.color} border-none`}>
              <SelectValue>
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-3 w-3" />
                  {statusConfig.label}
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-3 w-3" />
                      {config.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={8} className="p-4">
            <div className="space-y-4">
              <ProductsTable products={order.order_products} />
              
              {/* Botón de notificación */}
              {canNotify && (
                <div className="flex justify-end pt-2 border-t">
                  <Button
                    onClick={handleNotifyCustomer}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Notificar cliente por WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}