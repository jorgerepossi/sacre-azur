"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { perfumes } from "@/constants/perfumes";
import { createSlug } from "@/utils/slugGenerator";
import PerfumeDetails from "@/components/perfume-detail";


export default function PerfumeDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const slugParts = slug?.split("_");
    const id = Number.parseInt(slugParts?.[slugParts.length - 1]);

    const perfume = perfumes.find((p) => p.id === id);
    if (!perfume) notFound();

    const expectedSlug = `${createSlug(perfume.name)}_${perfume.id}`;
    if (slug !== expectedSlug) notFound();

    return <PerfumeDetails perfume={perfume} />;
}
