import { CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";

export const STATUS_INFO = {
  PENDIENTE: {
    label: "Pendiente",
    description: "Tu pedido está siendo revisado por el vendedor",
    icon: Clock,
    colorClass: "text-[hsl(var(--status-pending))]",
    bgColorClass: "bg-[hsl(var(--status-pending-bg))]",
    borderColorClass: "border-[hsl(var(--status-pending))]",
  },
  CONFIRMADO: {
    label: "Confirmado",
    description: "Tu pedido fue confirmado y está siendo preparado",
    icon: CheckCircle2,
    colorClass: "text-[hsl(var(--status-confirmed))]",
    bgColorClass: "bg-[hsl(var(--status-confirmed-bg))]",
    borderColorClass: "border-[hsl(var(--status-confirmed))]",
  },
  ENVIADO: {
    label: "Enviado",
    description: "Tu pedido está en camino",
    icon: Truck,
    colorClass: "text-[hsl(var(--status-shipped))]",
    bgColorClass: "bg-[hsl(var(--status-shipped-bg))]",
    borderColorClass: "border-[hsl(var(--status-shipped))]",
  },
  COMPLETADO: {
    label: "Completado",
    description: "Tu pedido fue entregado exitosamente",
    icon: Package,
    colorClass: "text-[hsl(var(--status-completed))]",
    bgColorClass: "bg-[hsl(var(--status-completed-bg))]",
    borderColorClass: "border-[hsl(var(--status-completed))]",
  },
  CANCELADO: {
    label: "Cancelado",
    description: "Este pedido fue cancelado",
    icon: XCircle,
    colorClass: "text-[hsl(var(--status-cancelled))]",
    bgColorClass: "bg-[hsl(var(--status-cancelled-bg))]",
    borderColorClass: "border-[hsl(var(--status-cancelled))]",
  },
} as const;

export const STATUS_ORDER = [
  "PENDIENTE",
  "CONFIRMADO",
  "ENVIADO",
  "COMPLETADO",
] as const;

export type OrderStatus = keyof typeof STATUS_INFO;
