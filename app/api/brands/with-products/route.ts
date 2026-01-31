import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const tenantSlug = request.headers.get("x-tenant-slug");

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

    // Traer brands que tienen productos activos
    const { data: tenantProducts, error } = await supabase
      .from("tenant_products")
      .select(
        `
        perfume:perfume_id(
          brand:brand_id(
            id,
            name,
            active,
            image
          )
        )
      `,
      )
      .eq("tenant_id", tenantId)
      .eq("active", true);

    if (error) {
      console.error("Error fetching brands:", error);
      return NextResponse.json(
        { error: "Error fetching brands" },
        { status: 500 },
      );
    }

    // Extraer brands únicas
    const brandsMap = new Map();

    tenantProducts?.forEach((tp: any) => {
      const perfume = Array.isArray(tp.perfume) ? tp.perfume[0] : tp.perfume;
      const brand = Array.isArray(perfume?.brand)
        ? perfume.brand[0]
        : perfume?.brand;

      if (brand && brand.active && !brandsMap.has(brand.id)) {
        brandsMap.set(brand.id, {
          id: brand.id,
          name: brand.name,
          active: brand.active,
          image: brand.image,
        });
      }
    });

    const brands = Array.from(brandsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}