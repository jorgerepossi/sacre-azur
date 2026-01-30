"use client";

import { useEffect } from "react";

import { useSearchParams } from "next/navigation";

import OrderInfo from "@/features/track/components/order-info";
import ProductsList from "@/features/track/components/products-list";
import ProgressTimeline from "@/features/track/components/progress-timeline";
import SearchForm from "@/features/track/components/search-form";
import StatusCard from "@/features/track/components/status-card";

import Flex from "@/components/flex";
import SmallLoader from "@/components/loaders/small";
import { Button } from "@/components/ui/button";

import { useTrackOrder } from "@/hooks/useTrackOrder";

import { OrderStatus } from "@/lib/tracking-status";

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code");

  const { order, loading, error, searchOrder } = useTrackOrder();

  useEffect(() => {
    if (codeFromUrl) {
      searchOrder(codeFromUrl);
    }
  }, [codeFromUrl]);

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-center text-3xl font-bold">
          📦 Seguimiento de Pedido
        </h1>

        <SearchForm
          onSearch={searchOrder}
          loading={loading}
          initialCode={codeFromUrl || ""}
        />

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <Flex className="justify-center py-10">
            <SmallLoader />
          </Flex>
        )}

        {order && !loading && (
          <div className="space-y-6">
            <StatusCard status={order.status as OrderStatus} />
            <Flex className="justify-center">
              <Button
                onClick={() => searchOrder(order.order_code)}
                variant="outline"
                disabled={loading}
              >
                🔄 Actualizar estado
              </Button>
            </Flex>
            <OrderInfo order={order} />
            <ProductsList products={order.order_products} />
            <ProgressTimeline currentStatus={order.status as OrderStatus} />
          </div>
        )}
      </div>
    </div>
  );
}
