import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export const saveOrder = async (items: any[], email: string = "no-reply@sacreazur.com") => {
    const order_code = uuidv4();

    const { error } = await supabase.from("orders").insert([
        {
            order_code,
            order_email: email,
            order_products: items,
        },
    ]);

    if (error) {
        console.error("Error saving order:", error.message);
        throw new Error("Error saving order");
    }

    return order_code;
};