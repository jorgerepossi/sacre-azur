import { notFound } from "next/navigation";
import { createSlug } from "@/utils/slugGenerator";
import PerfumeDetails from "@/components/perfume-detail";
import { supabase } from "@/lib/supabaseClient";

import type { Metadata } from "next";

type Props = {
    params: {
        slug: string;
    };
};

export default async function PerfumeDetailPage({ params }: Props) {
    const slug = params.slug;
    const slugParts = slug.split("_");
    const id = slugParts[slugParts.length - 1];

    if (!id) return notFound();

    const { data: perfume, error } = await supabase
        .from("perfume")
        .select("*, brand(*)")
        .eq("id", id)
        .single();

    if (error || !perfume) return notFound();

    const expectedSlug = `${createSlug(perfume.name)}_${perfume.id}`;
    if (slug !== expectedSlug) return notFound();

    return <PerfumeDetails perfume={perfume} />;
}