"use client";

import { useTenant } from "@/providers/TenantProvider";
import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";

const fetchOrders = async (tenantId?: string) => {
  if (!tenantId) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_shipping (
        id,
        shipping_address,
        shipping_province,
        shipping_city,
        shipping_postal_code,
        shipping_method,
        shipping_cost,
        tracking_number,
        tracking_url,
        internal_notes,
        created_at,
        updated_at
      )
    `,
    )
    .eq("tenant_id", tenantId) // ← AGREGAR FILTRO
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const useFetchOrders = () => {
  const { tenant } = useTenant();

  return useQuery({
    queryKey: ["orders", tenant?.id],
    queryFn: () => fetchOrders(tenant?.id),
    enabled: !!tenant?.id,
  });
};

export default useFetchOrders;
