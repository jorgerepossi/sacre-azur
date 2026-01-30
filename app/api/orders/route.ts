import { NextRequest, NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

import { supabase } from "@/lib/supabaseClient";

import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, products } = body;

    // Get tenant slug from headers (set by middleware)
    const tenantSlug = req.headers.get("x-tenant-slug");

    if (!tenantSlug) {
      return NextResponse.json(
        { error: "Tenant not specified" },
        { status: 400 },
      );
    }

    // Get tenant ID
    const tenantId = await getTenantIdFromSlug(tenantSlug);

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    const order_code = uuidv4();

    const { data, error } = await supabase.from("orders").insert([
      {
        order_code,
        order_email: email,
        order_products: products,
        tenant_id: tenantId,
      },
    ]);

    if (error) {
      return NextResponse.json(
        { error: "Failed to save order" },
        { status: 500 },
      );
    }

    return NextResponse.json({ order_code });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
