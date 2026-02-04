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

  console.log("=== PERFUME PAGE DEBUG ===");
  console.log("1. Tenant:", tenant);
  console.log("2. Slug:", slug);

  const slugParts = slug.split("_");
  const id = slugParts[slugParts.length - 1];
  console.log("3. Extracted ID:", id);

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    console.log("❌ Invalid ID format");
    return notFound();
  }

  const tenantId = await getTenantIdFromSlug(tenant);
  console.log("4. Tenant ID:", tenantId);

  if (!tenantId) {
    console.log("❌ Tenant not found");
    return notFound();
  }

  console.log("5. Querying Supabase...");
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
          slug,
          image,
          active,
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

  console.log("6. Supabase result:", tenantProduct);
  console.log("7. Supabase error:", error);

  if (error || !tenantProduct) {
    console.log("❌ No tenant product found");
    return notFound();
  }

  console.log("8. Processing perfume data...");
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
    is_active: true,
    tenant_id: tenantProduct.tenant_id,
  };

  const expectedSlug = `${createSlug(perfume.name)}_${perfume.id}`;
  console.log("9. Expected slug:", expectedSlug);
  console.log("10. Received slug:", slug);

  if (slug !== expectedSlug) {
    console.log("❌ Slug mismatch");
    return notFound();
  }

  console.log("✅ All checks passed, rendering perfume");

  return (
    <section>
      <Suspense fallback={<SmallLoader />}>
        <PerfumeDetails perfume={perfume} />
      </Suspense>
    </section>
  );
}
