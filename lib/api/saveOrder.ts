import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabaseClient";

export const saveOrder = async (
  items: any[],
  tenantId: string, // <-- NUEVO
  customerName?: string,
  customerPhone?: string,
) => {
  const order_code = uuidv4();

  const { error } = await supabase.from("orders").insert([
    {
      order_code,
      tenant_id: tenantId, // <-- NUEVO
      customer_name: customerName || null,
      customer_phone: customerPhone || null,
      order_products: items,
      status: 'PENDIENTE',  
    },
  ]);

  if (error) {
    console.error("Error saving order:", error.message);
    throw new Error("Error saving order");
  }

  return order_code;
};