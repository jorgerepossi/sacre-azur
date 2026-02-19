"use client";

import { useEffect, useState } from "react";

import { useTenant } from "@/providers/TenantProvider";

import { getBaseUrl } from "@/lib/config";
import { CatalogPerfume } from "@/types/perfume.type";

export const useCatalogSearch = (brandId?: string) => {
    const { tenant } = useTenant();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<CatalogPerfume[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tenant?.slug) return;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            setIsLoading(true);
            setError(null);
            try {
                const baseUrl = getBaseUrl();
                const params = new URLSearchParams();
                if (query) params.append("q", query);
                if (brandId) params.append("brand_id", brandId);

                const response = await fetch(
                    `${baseUrl}/api/catalog/perfumes?${params.toString()}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "x-tenant-slug": tenant.slug,
                        },
                        cache: "no-store",
                        signal: controller.signal,
                    },
                );

                if (!response.ok) throw new Error("Error buscando en catálogo");

                const data: CatalogPerfume[] = await response.json();
                setResults(data);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError(err.message ?? "Error desconocido");
                    setResults([]);
                }
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query, brandId, tenant?.slug]);

    return { query, setQuery, results, isLoading, error };
};
