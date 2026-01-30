import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";

import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
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

    // Filtro de notas - obtener perfume_ids que tengan las notas seleccionadas
    const notes = searchParams.get("notes");
    let perfumeIdsWithNotes: string[] | null = null;

    if (notes) {
      const noteArray = notes.split(",").map((n) => parseInt(n));

      // Buscar perfumes que tengan TODAS las notas seleccionadas
      const { data: noteRelations } = await supabase
        .from("perfume_note_relation")
        .select("perfume_id, note_id")
        .in("note_id", noteArray);

      if (noteRelations) {
        // Agrupar por perfume_id y contar cuántas notas tiene
        const perfumeCounts = noteRelations.reduce((acc: any, rel: any) => {
          acc[rel.perfume_id] = (acc[rel.perfume_id] || 0) + 1;
          return acc;
        }, {});

        // Solo perfumes que tengan TODAS las notas seleccionadas
        perfumeIdsWithNotes = Object.keys(perfumeCounts).filter(
          (id) => perfumeCounts[id] === noteArray.length,
        );
      }
    }

    let query = supabase
      .from("tenant_products")
      .select(
        `
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
          ),
          perfume_note_relation (
            note_id,
            perfume_notes:note_id (
              id,
              name
            )
          )
        )
      `,
      )
      .eq("tenant_id", tenantId)
      .eq("active", true);

    const brands = searchParams.get("brands");
    if (brands) {
      const brandArray = brands.split(",");
      query = query.in("perfume.brand_id", brandArray);
    }

    if (perfumeIdsWithNotes && perfumeIdsWithNotes.length > 0) {
      query = query.in("perfume_id", perfumeIdsWithNotes);
    } else if (
      notes &&
      (!perfumeIdsWithNotes || perfumeIdsWithNotes.length === 0)
    ) {
      return NextResponse.json([], {
        headers: {
          "Cache-Control": "public, max-age=3600",
          "CDN-Cache-Control": "public, max-age=3600",
        },
      });
    }

    const { data, error } = await query;

    if (error) throw error;

    const transformedData = data
      ?.map((item) => {
        const perfume = Array.isArray(item.perfume)
          ? item.perfume[0]
          : item.perfume;
        const brand = Array.isArray(perfume?.brand)
          ? perfume.brand[0]
          : perfume?.brand;

        // Si no hay perfume o datos críticos, devolver null
        if (!perfume?.id || !perfume?.name) {
          return null;
        }

        // Transformar notas
        const perfumeNotes =
          perfume.perfume_note_relation?.map((rel: any) => {
            const note = Array.isArray(rel.perfume_notes)
              ? rel.perfume_notes[0]
              : rel.perfume_notes;
            return {
              note_id: rel.note_id,
              perfume_notes: note,
            };
          }) || [];

        return {
          id: perfume.id,
          name: perfume.name,
          description: perfume.description,
          image: perfume.image,
          external_link: perfume.external_link,
          created_at: perfume.created_at,
          brand: brand,
          perfume_note_relation: perfumeNotes,
          price: item.price,
          profit_margin: item.profit_margin,
          sizes_available: item.sizes_available,
          stock: item.stock,
          tenant_product_id: item.id,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return NextResponse.json(transformedData, {
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
