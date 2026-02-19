import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";

import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export const revalidate = 0;
export const dynamic = "force-dynamic";

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
        .from("perfume_to_notes")
        .select("perfume_id, note_id")
        .in("note_id", noteArray);

      if (noteRelations) {
        const perfumeCounts = noteRelations.reduce((acc: any, rel: any) => {
          acc[rel.perfume_id] = (acc[rel.perfume_id] || 0) + 1;
          return acc;
        }, {});

        perfumeIdsWithNotes = Object.keys(perfumeCounts).filter(
          (id) => perfumeCounts[id] === noteArray.length,
        );
      }
    }

    const isMinimal = searchParams.get("minimal") === "true";

    let query = supabase
      .from("tenant_products")
      .select(
        isMinimal
          ? `
        id,
        price,
        profit_margin,
        size,
        stock,
        active,
        perfume:perfume_id (
          id,
          name,
          image,
          brand:brand_id (
            name
          )
        )
      `
          : `
        id,
        price,
        profit_margin,
        size,
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
      .eq("tenant_id", tenantId)
      .eq("active", true);

    const brands = searchParams.get("brands");
    if (brands) {
      const brandSlugs = brands.split(",");

      // Convertir slugs a IDs
      const { data: brandData } = await supabase
        .from("brand")
        .select("id")
        .in("slug", brandSlugs);

      if (brandData && brandData.length > 0) {
        const brandIds = brandData.map((b) => b.id);
        query = query.in("perfume.brand_id", brandIds);
      }
    }

    if (perfumeIdsWithNotes && perfumeIdsWithNotes.length > 0) {
      query = query.in("perfume_id", perfumeIdsWithNotes);
    } else if (
      notes &&
      (!perfumeIdsWithNotes || perfumeIdsWithNotes.length === 0)
    ) {
      // SIN CACHE AQUÍ
      return NextResponse.json([]);
    }

    const { data, error } = await query;

    if (error) throw error;

    const transformedData = (data as any[])
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

        if (isMinimal) {
          return {
            id: perfume.id,
            name: perfume.name,
            image: perfume.image,
            brand: brand,
            // Pre-calcular precio con el margen para no exponerlo en el JSON
            price: Math.round(Number(item.price) * (1 + (Number(item.profit_margin) || 0) / 100)),
            profit_margin: 0,
            size: item.size,
            in_stock: item.stock > 0,
            tenant_product_id: item.id,
          };
        }

        // Transformar notas
        const perfumeNotes =
          perfume.perfume_to_notes?.map((rel: any) => {
            const note = Array.isArray(rel.perfume_notes)
              ? rel.perfume_notes[0]
              : rel.perfume_notes;
            return {
              note_id: rel.note_id,
              note_type: rel.note_type,
              perfume_notes: note,
            };
          }) || [];

        // Transformar familias (acordes)
        const perfumeFamilies =
          perfume.perfume_to_families?.map((rel: any) => {
            const family = Array.isArray(rel.olfactive_families)
              ? rel.olfactive_families[0]
              : rel.olfactive_families;
            return {
              family_id: rel.family_id,
              olfactive_families: family,
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
          perfume_family_relation: perfumeFamilies,
          price: item.price,
          profit_margin: item.profit_margin,
          size: item.size,
          sizes_available: item.sizes_available,
          in_stock: item.stock > 0,
          tenant_product_id: item.id,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error en API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
