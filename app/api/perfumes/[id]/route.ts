import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const tenantSlug = request.headers.get('x-tenant-slug');
    
    if (!tenantSlug) {
      return NextResponse.json({ error: 'Tenant not specified' }, { status: 400 });
    }

    const tenantId = await getTenantIdFromSlug(tenantSlug);
    
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    const { data: tenantProduct, error } = await supabase
      .from("tenant_products")
      .select(`
        price,
        profit_margin,
        perfume:perfume_id (
          id,
          name,
          description,
          image,
          external_link,
          created_at,
          brand:brand_id (
            id,
            name,
            image,
            active,
            tenant_id,
            created_at
          ),
          perfume_note_relation (
            perfume_notes:note_id (
              id,
              name
            )
          )
        )
      `)
      .eq("perfume_id", params.id)
      .eq("tenant_id", tenantId)
      .single();

    if (error || !tenantProduct) {
      return NextResponse.json({ error: "Perfume no encontrado" }, { status: 404 });
    }

    const perfume = Array.isArray(tenantProduct.perfume) 
      ? tenantProduct.perfume[0] 
      : tenantProduct.perfume;

    const response = {
      ...perfume,
      price: tenantProduct.price,
      profit_margin: tenantProduct.profit_margin,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching perfume:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}