"use client";

import React from "react";
import { CheckCircle2, ChevronDown, ChevronUp, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  calculateOrderTotal,
  formatDate,
  formatPrice,
  type Order,
} from "@/utils/order-utils";

import ProductsTable from "./products-table";

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export default function OrderRow({
  order,
  isExpanded,
  onToggleExpand,
}: OrderRowProps) {
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
        <TableCell onClick={onToggleExpand}>{order.order_email}</TableCell>
        <TableCell onClick={onToggleExpand}>
          {order.order_products.length}{" "}
          {order.order_products.length === 1 ? "item" : "items"}
        </TableCell>
        <TableCell className="text-right" onClick={onToggleExpand}>
          {formatPrice(calculateOrderTotal(order.order_products))}
        </TableCell>
        <TableCell className="text-right" onClick={onToggleExpand}>
          {order.is_sent ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Sent
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
            >
              <XCircle className="mr-1 h-3 w-3" /> Pending
            </Badge>
          )}
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="p-4">
            <ProductsTable products={order.order_products} />
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
