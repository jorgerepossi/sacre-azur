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

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    return notFound();
  }

  const tenantId = await getTenantIdFromSlug(tenant);

  if (!tenantId) {
    return notFound();
  }

  // Traer product_type del tenant
  const { data: tenantInfo } = await supabase
    .from("tenants")
    .select("product_type")
    .eq("id", tenantId)
    .single();

  const { data: tenantProduct, error } = await supabase
    .from("tenant_products")
    .select(
      `
      price,
      profit_margin,
      stock,
      tenant_id,
      size,
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
          slug,
          image,
          active,
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
    console.error("Supabase error fetching perfume detail:", error);
    return notFound();
  }

  if (!tenantProduct) {
    return notFound();
  }

  const perfumeData = Array.isArray(tenantProduct.perfume)
    ? tenantProduct.perfume[0]
    : tenantProduct.perfume;

  const brandData = Array.isArray(perfumeData?.brand)
    ? perfumeData.brand[0]
    : perfumeData?.brand;

  const brand = {
    ...brandData,
    slug: brandData?.slug || createSlug(brandData?.name || ""),
  };

  const perfumeNoteRelation = perfumeData?.perfume_to_notes?.map(
    (relation: any) => ({
      note_id: relation.note_id,
      note_type: relation.note_type,
      perfume_notes: Array.isArray(relation.perfume_notes)
        ? relation.perfume_notes[0]
        : relation.perfume_notes,
    }),
  );

  const perfumeFamilyRelation = perfumeData?.perfume_to_families?.map(
    (relation: any) => ({
      family_id: relation.family_id,
      olfactive_families: Array.isArray(relation.olfactive_families)
        ? relation.olfactive_families[0]
        : relation.olfactive_families,
    }),
  );

  const perfume = {
    ...perfumeData,
    brand: brand,
    perfume_note_relation: perfumeNoteRelation,
    perfume_family_relation: perfumeFamilyRelation,
    price: Number(tenantProduct.price),
    profit_margin: Number(tenantProduct.profit_margin),
    size: tenantProduct.size ? Number(tenantProduct.size) : undefined,
    in_stock: tenantProduct.stock > 0,
    is_active: true,
    tenant_id: tenantProduct.tenant_id,
    product_type: tenantInfo?.product_type || "decant",
  };

  const expectedSlug = `${createSlug(perfume.name)}_${perfume.id}`;
  if (slug !== expectedSlug) {
    return notFound();
  }

  return (
    <section>
      <Suspense fallback={<SmallLoader />}>
        <PerfumeDetails perfume={perfume} />
      </Suspense>
    </section>
  );
}