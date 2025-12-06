import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";
import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get tenant slug from headers (set by middleware)
    const tenantSlug = request.headers.get('x-tenant-slug');

    if (!tenantSlug) {
      return NextResponse.json(
        { error: 'Tenant not specified' },
        { status: 400 }
      );
    }

    // Get tenant ID
    const tenantId = await getTenantIdFromSlug(tenantSlug);

    if (!tenantId) {
      return NextResponse.json(
        { error: 'Tenant not found' },
        { status: 404 }
      );
    }

    let query = supabase
      .from("perfume")
      .select("*, brand(name, image)")
      .eq("tenant_id", tenantId)
      .order("created_at");

    const brands = searchParams.get("brands");
    if (brands) {
      const brandArray = brands.split(",");
      query = query.in("brand_id", brandArray);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "CDN-Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error en API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
