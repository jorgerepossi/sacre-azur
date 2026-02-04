"use client";

import React, { useState } from "react";

import { format } from "date-fns";
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Search,
  XCircle,
} from "lucide-react";

import Box from "@/components/box";
import ContentBlock from "@/components/content-block";
import Flex from "@/components/flex";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useFetchOrders from "@/hooks/useFetchOrders";

interface Product {
  name: string;
  size: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  order_code: string;
  created_at: string;
  order_email: string;
  order_products: Product[];
  is_sent: boolean;
}

export default function OrdersTable() {
  const { data: orders, isLoading, error } = useFetchOrders();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order | null;
    direction: "ascending" | "descending";
  }>({
    key: "created_at",
    direction: "descending",
  });

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-AR")}`;
  };

  const calculateOrderTotal = (products: Product[]) => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0,
    );
  };

  const requestSort = (key: keyof Order) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedOrders = orders
    ? orders
        .filter((order) => {
          const searchLower = searchTerm.toLowerCase();
          return (
            order.order_code.toLowerCase().includes(searchLower) ||
            order.order_email.toLowerCase().includes(searchLower) ||
            order.order_products.some((product: Product) =>
              product.name.toLowerCase().includes(searchLower),
            )
          );
        })
        .sort((a, b) => {
          if (!sortConfig.key) return 0;

          const aValue = a[sortConfig.key];
          const bValue = b[sortConfig.key];

          if (sortConfig.key === "created_at") {
            return sortConfig.direction === "ascending"
              ? new Date(aValue as string).getTime() -
                  new Date(bValue as string).getTime()
              : new Date(bValue as string).getTime() -
                  new Date(aValue as string).getTime();
          }

          if (typeof aValue === "boolean" && typeof bValue === "boolean") {
            return sortConfig.direction === "ascending"
              ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
              : (bValue ? 1 : 0) - (aValue ? 1 : 0);
          }

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortConfig.direction === "ascending"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          return 0;
        })
    : [];

  if (isLoading) {
    return (
      <Flex className="h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading orders...</span>
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load orders. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ContentBlock title={"Orders"}>
      <div className=" ">
        <Flex className="mb-6 flex items-center">
          <Box className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Flex>

        <Box className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead className="w-[400px]">
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("order_code")}
                    className="flex items-center"
                  >
                    Código de Orden
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("created_at")}
                    className="flex items-center"
                  >
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Products</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead
                  className={"flex items-center justify-end text-right"}
                >
                  <Button
                    variant="ghost"
                    onClick={() => requestSort("is_sent")}
                    className="flex items-end"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAndSortedOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <TableRow
                      key={order.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell onClick={() => toggleRowExpansion(order.id)}>
                        {expandedRows[order.id] ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </TableCell>
                      <TableCell
                        className="font-medium"
                        onClick={() => toggleRowExpansion(order.id)}
                      >
                        {order.order_code}
                      </TableCell>
                      <TableCell onClick={() => toggleRowExpansion(order.id)}>
                        {format(
                          new Date(order.created_at),
                          "MMM dd, yyyy HH:mm",
                        )}
                      </TableCell>
                      <TableCell onClick={() => toggleRowExpansion(order.id)}>
                        {order.order_email}
                      </TableCell>
                      <TableCell onClick={() => toggleRowExpansion(order.id)}>
                        {order.order_products.length}{" "}
                        {order.order_products.length === 1 ? "item" : "items"}
                      </TableCell>
                      <TableCell
                        className="text-right"
                        onClick={() => toggleRowExpansion(order.id)}
                      >
                        {formatPrice(calculateOrderTotal(order.order_products))}
                      </TableCell>
                      <TableCell
                        className={"text-right"}
                        onClick={() => toggleRowExpansion(order.id)}
                      >
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
                    {expandedRows[order.id] && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={7} className="p-4">
                          <div className="rounded-md border bg-background">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Producto</TableHead>
                                  <TableHead>Tamaño</TableHead>
                                  <TableHead className="text-right">
                                    Precio
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Cantidad
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Subtotal
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.order_products.map(
                                  (product: Product) => (
                                    <TableRow key={product.name}>
                                      <TableCell className="font-medium">
                                        {product.name}
                                      </TableCell>
                                      <TableCell>{product.size} ml</TableCell>
                                      <TableCell className="text-right">
                                        {formatPrice(product.price)}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {product.quantity}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {formatPrice(
                                          product.price * product.quantity,
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ),
                                )}
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    className="text-right font-bold"
                                  >
                                    Total:
                                  </TableCell>
                                  <TableCell className="text-right font-bold">
                                    {formatPrice(
                                      calculateOrderTotal(order.order_products),
                                    )}
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </div>
    </ContentBlock>
  );
}
