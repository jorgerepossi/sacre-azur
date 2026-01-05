import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantSlug = request.headers.get('x-tenant-slug');

    if (!tenantSlug) {
      return NextResponse.json({ error: 'Tenant not specified' }, { status: 400 });
    }

    const tenantId = await getTenantIdFromSlug(tenantSlug);
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Query CON JOIN
    let query = supabase
      .from("tenant_products")
      .select(`
        id,
        price,
        profit_margin,
        sizes_available,
        stock,
        active,
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
            image
          )
        )
      `)
      .eq("tenant_id", tenantId)
      .eq("active", true);

    // Filtro de marcas
    const brands = searchParams.get("brands");
    if (brands) {
      const brandArray = brands.split(",");
      query = query.in("perfume.brand_id", brandArray);
    }

   const { data, error  } = await query;

 if (error) throw error;

    // Transformar respuesta
    const transformedData = data?.map(item => {
      const perfume = Array.isArray(item.perfume) ? item.perfume[0] : item.perfume;
      const brand = Array.isArray(perfume?.brand) ? perfume.brand[0] : perfume?.brand;
      
      return {
        id: perfume?.id,
        name: perfume?.name,
        description: perfume?.description,
        image: perfume?.image,
        external_link: perfume?.external_link,
        created_at: perfume?.created_at,
        brand: brand,
        price: item.price,
        profit_margin: item.profit_margin,
        sizes_available: item.sizes_available,
        stock: item.stock,
        tenant_product_id: item.id,
      };
    });

    return NextResponse.json(transformedData, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "CDN-Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error en API:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}