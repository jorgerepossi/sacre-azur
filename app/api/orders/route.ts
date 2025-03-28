import { NextRequest, NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

import { supabase } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, products } = body;

  const order_code = uuidv4();

  const { data, error } = await supabase.from("orders").insert([
    {
      order_code,
      order_email: email,
      order_products: products,
    },
  ]);

  if (error) {
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 },
    );
  }

  return NextResponse.json({ order_code });
}
