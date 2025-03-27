"use client";

import { useQuery } from "@tanstack/react-query";

import { createClient } from "@/utils/supabase/client";

const fetchOrders = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("orders").select("*");
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
