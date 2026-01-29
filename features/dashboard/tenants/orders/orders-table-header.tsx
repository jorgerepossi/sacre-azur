"use client";

import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Order } from "@/utils/order-utils";

interface OrdersTableHeaderProps {
  onRequestSort: (key: keyof Order) => void;
}

export default function OrdersTableHeader({
  onRequestSort,
}: OrdersTableHeaderProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-10"></TableHead>
        <TableHead className="w-[400px]">
          <Button
            variant="ghost"
            onClick={() => onRequestSort("order_code")}
            className="flex items-center"
          >
            Order Code
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onRequestSort("created_at")}
            className="flex items-center"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Phone</TableHead>
        <TableHead>Products</TableHead>
        <TableHead className="text-right">Total</TableHead>
        <TableHead className="flex items-center justify-end text-right">
          <Button
            variant="ghost"
            onClick={() => onRequestSort("is_sent")}
            className="flex items-end"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
