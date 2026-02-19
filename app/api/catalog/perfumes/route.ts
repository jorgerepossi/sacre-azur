import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";
import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tenantSlug = request.headers.get("x-tenant-slug");
        const query = searchParams.get("q") ?? "";
        const brandId = searchParams.get("brand_id");

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

        // Obtener IDs de perfumes que el tenant ya tiene en su inventario
        const { data: existingProducts } = await supabase
            .from("tenant_products")
            .select("perfume_id")
            .eq("tenant_id", tenantId);

        const excludedPerfumeIds =
            existingProducts?.map((p) => p.perfume_id).filter(Boolean) ?? [];

        // Buscar en el catálogo maestro
        let catalogQuery = supabase
            .from("perfume")
            .select(
                `
        id,
        name,
        description,
        image,
        external_link,
        created_at,
        brand:brand_id (
          id,
          name,
          slug,
          image,
          active
        ),
        perfume_to_notes (
          note_id,
          note_type,
          perfume_notes (
            id,
            name
          )
        ),
        perfume_to_families (
          family_id,
          olfactive_families (
            id,
            name
          )
        )
      `,
            )
            .ilike("name", `%${query}%`)
            .order("name", { ascending: true })
            .limit(50);

        if (brandId) {
            catalogQuery = catalogQuery.eq("brand_id", brandId);
        }

        if (excludedPerfumeIds.length > 0) {
            catalogQuery = catalogQuery.not(
                "id",
                "in",
                `(${excludedPerfumeIds.join(",")})`,
            );
        }

        const { data, error } = await catalogQuery;

        if (error) throw error;

        // Transformar datos al formato esperado por el cliente
        const transformed = (data ?? []).map((item: any) => {
            const brand = Array.isArray(item.brand) ? item.brand[0] : item.brand;

            const noteRelations = (item.perfume_to_notes ?? []).map(
                (rel: any) => {
                    const note = Array.isArray(rel.perfume_notes)
                        ? rel.perfume_notes[0]
                        : rel.perfume_notes;
                    return {
                        note_id: rel.note_id,
                        note_type: rel.note_type,
                        perfume_notes: note,
                    };
                },
            );

            const familyRelations = (item.perfume_to_families ?? []).map(
                (rel: any) => {
                    const family = Array.isArray(rel.olfactive_families)
                        ? rel.olfactive_families[0]
                        : rel.olfactive_families;
                    return {
                        family_id: rel.family_id,
                        olfactive_families: family,
                    };
                },
            );

            return {
                id: item.id,
                name: item.name,
                description: item.description,
                image: item.image,
                external_link: item.external_link,
                created_at: item.created_at,
                brand,
                perfume_note_relation: noteRelations,
                perfume_family_relation: familyRelations,
            };
        });

        return NextResponse.json(transformed);
    } catch (error) {
        console.error("Error en catalog API:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 },
        );
    }
}
