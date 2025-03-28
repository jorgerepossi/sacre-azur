"use client";

import { useState } from "react";

import Box from "@/components/box";
import ContentBlock from "@/components/content-block";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import useFetchOrders from "@/hooks/useFetchOrders";
import {
  filterOrders,
  type Order,
  type SortConfig,
  sortOrders,
} from "@/utils/order-utils";

import ErrorState from "./error-state";
import LoadingState from "./loading-state";
import OrderRow from "./order-row";
import OrdersTableHeader from "./orders-table-header";
import SearchBar from "./search-bar";

//import OrdersTable from "@/features/dashboard/orders/order-table";

export default function OrdersTable() {
  const { data: orders, isLoading, error } = useFetchOrders();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "created_at",
    direction: "descending",
  });

  const toggleRowExpansion = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const requestSort = (key: keyof Order) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  const filteredOrders = filterOrders(orders || [], searchTerm);
  const filteredAndSortedOrders = sortOrders(filteredOrders, sortConfig);

  return (
    <ContentBlock title="Orders">
      <div>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <Box className="rounded-md border">
          <Table>
            <OrdersTableHeader onRequestSort={requestSort} />
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
                  <OrderRow
                    key={order.id}
                    order={order}
                    isExpanded={expandedRows[order.id]}
                    onToggleExpand={() => toggleRowExpansion(order.id)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </Box>
      </div>
    </ContentBlock>
  );
}
