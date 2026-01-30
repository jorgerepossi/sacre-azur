import { Suspense } from "react";

import { notFound } from "next/navigation";

import SmallLoader from "@/components/loaders/small";
import PerfumeDetails from "@/components/perfume-detail";

import { supabase } from "@/lib/supabaseClient";

import { createSlug } from "@/utils/slugGenerator";
import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export default async function Page({
  params,
}: {
  params: Promise<{ tenant: string; slug: string }>;
}) {
  const { tenant, slug } = await params;

  const slugParts = slug.split("_");
  const id = slugParts[slugParts.length - 1];

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) return notFound();

  // Obtener tenant ID
  const tenantId = await getTenantIdFromSlug(tenant);
  if (!tenantId) return notFound();

  // Query desde tenant_products con JOINs
  const { data: tenantProduct, error } = await supabase
    .from("tenant_products")
    .select(
      `
      price,
      profit_margin,
      stock,
      tenant_id,
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
          note_id,
          perfume_notes:note_id (
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

  if (error || !tenantProduct) return notFound();

  // Transformar para mantener compatibilidad
  const perfumeData = Array.isArray(tenantProduct.perfume)
    ? tenantProduct.perfume[0]
    : tenantProduct.perfume;

  const brand = Array.isArray(perfumeData?.brand)
    ? perfumeData.brand[0]
    : perfumeData?.brand;

  // Transformar perfume_note_relation
  const perfumeNoteRelation = perfumeData?.perfume_note_relation?.map(
    (relation: any) => ({
      note_id: relation.note_id,
      perfume_notes: Array.isArray(relation.perfume_notes)
        ? relation.perfume_notes[0]
        : relation.perfume_notes,
    }),
  );

  const perfume = {
    ...perfumeData,
    brand: brand,
    perfume_note_relation: perfumeNoteRelation,
    price: tenantProduct.price,
    profit_margin: tenantProduct.profit_margin,
    in_stock: tenantProduct.stock > 0,
    tenant_id: tenantProduct.tenant_id,
  };

  const expectedSlug = `${createSlug(perfume.name)}_${perfume.id}`;
  if (slug !== expectedSlug) return notFound();

  return (
    <section>
      <Suspense fallback={<SmallLoader />}>
        <PerfumeDetails perfume={perfume} />
      </Suspense>
    </section>
  );
}
