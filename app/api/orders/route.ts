import { NextRequest, NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

import { supabase } from "@/lib/supabaseClient";

import { getTenantIdFromSlug } from "@/utils/tenantUtils";

import { calculateDecantPrice } from "@/lib/pricing-constants";

interface OrderItemInput {
  id: string; // perfume id
  name?: string;
  size: number;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerPhone, items } = body as {
      customerName?: string;
      customerPhone?: string;
      items: OrderItemInput[];
    };

    const tenantSlug = req.headers.get("x-tenant-slug");

    if (!tenantSlug) {
      return NextResponse.json(
        { error: "Tenant not specified" },
        { status: 400 },
      );
    }

    const tenantId = await getTenantIdFromSlug(tenantSlug);

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 },
      );
    }

    const { data: tenantRow } = await supabase
      .from("tenants")
      .select("product_type")
      .eq("id", tenantId)
      .single();

    const isDecantSeller =
      !tenantRow?.product_type || tenantRow.product_type === "decant";

    // Precio y stock se recalculan acá con datos frescos de la base —
    // nunca se confía en lo que mande el cliente (podría venir alterado
    // desde devtools/localStorage).
    const order_products = [];

    for (const item of items) {
      if (!item?.id || !item?.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: "Producto inválido en el carrito" },
          { status: 400 },
        );
      }

      const { data: tenantProduct, error } = await supabase
        .from("tenant_products")
        .select("price, profit_margin, stock, active, perfume:perfume_id(name)")
        .eq("perfume_id", item.id)
        .eq("tenant_id", tenantId)
        .single();

      if (error || !tenantProduct || !tenantProduct.active) {
        return NextResponse.json(
          { error: `Producto no disponible: ${item.name || item.id}` },
          { status: 409 },
        );
      }

      if ((tenantProduct.stock ?? 0) <= 0) {
        return NextResponse.json(
          { error: `Sin stock: ${item.name || item.id}` },
          { status: 409 },
        );
      }

      const perfume = Array.isArray(tenantProduct.perfume)
        ? tenantProduct.perfume[0]
        : tenantProduct.perfume;

      const price = calculateDecantPrice(
        Number(tenantProduct.price),
        Number(tenantProduct.profit_margin) || 0,
        Number(item.size),
        isDecantSeller,
      );

      order_products.push({
        name: perfume?.name || item.name || "Producto",
        size: item.size,
        quantity: item.quantity,
        price,
      });
    }

    const order_code = uuidv4();

    const { error: insertError } = await supabase.from("orders").insert([
      {
        order_code,
        tenant_id: tenantId,
        customer_name: customerName || null,
        customer_phone: customerPhone || null,
        order_products,
        status: "PENDIENTE",
      },
    ]);

    if (insertError) {
      console.error("Error saving order:", insertError);
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
