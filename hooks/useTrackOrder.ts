import { useState } from "react";

import { supabase } from "@/lib/supabaseClient";

export const useTrackOrder = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchOrder = async (orderCode: string) => {
    if (!orderCode.trim()) {
      setError("Por favor ingresá un código de pedido");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_code", orderCode.trim())
        .single();

      if (fetchError || !data) {
        setError("No se encontró un pedido con ese código");
        setOrder(null);
      } else {
        setOrder(data);
        setError(null);
      }
    } catch (err) {
      setError("Error al buscar el pedido");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return { order, loading, error, searchOrder };
};
