import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";

import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // <-- AWAIT params
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

    const { data: tenantProduct, error } = await supabase
      .from("tenant_products")
      .select(
        `
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
        )
      `,
      )
      .eq("perfume_id", id)
      .eq("tenant_id", tenantId)
      .single();

    if (error) {
      console.error("Supabase error fetching perfume:", error);
      return NextResponse.json(
        { error: "Error de base de datos", details: error.message },
        { status: 500 },
      );
    }

    if (!tenantProduct) {
      return NextResponse.json(
        { error: "Perfume no encontrado" },
        { status: 404 },
      );
    }

    const perfume = Array.isArray(tenantProduct.perfume)
      ? tenantProduct.perfume[0]
      : tenantProduct.perfume;

    const noteRelations = (perfume.perfume_to_notes ?? []).map(
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

    const familyRelations = (perfume.perfume_to_families ?? []).map(
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

    const response = {
      ...perfume,
      perfume_note_relation: noteRelations,
      perfume_family_relation: familyRelations,
      price: tenantProduct.price,
      profit_margin: tenantProduct.profit_margin,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching perfume:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
