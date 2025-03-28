// app/perfumes/[slug]/page.tsx
import { Suspense } from "react";

import { notFound } from "next/navigation";

import SmallLoader from "@/components/loaders/small";
import PerfumeDetails from "@/components/perfume-detail";

import { supabase } from "@/lib/supabaseClient";

import { createSlug } from "@/utils/slugGenerator";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const slugParts = slug.split("_");
  const id = slugParts[slugParts.length - 1];

  if (!id || !/^[0-9a-f-]{36}$/.test(id)) return notFound();

  const { data: perfume, error } = await supabase
    .from("perfume")
    .select(
      `
      *,
      brand(*),
      perfume_note_relation:perfume_note_relation (
        perfume_notes:note_id (id, name)
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !perfume) return notFound();

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
