"use client";

import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";

const fetchOrders = async () => {
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
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const useFetchOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });
};

export default useFetchOrders;
