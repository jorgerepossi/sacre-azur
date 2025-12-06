import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";
import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export async function GET(request: Request) {
  try {
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

    const { data, error } = await supabase
      .from("brand")
      .select("id, name, active, image")
      .eq("tenant_id", tenantId)
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Error fetching brands" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "CDN-Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
