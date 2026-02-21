"use client";

import { useTenant } from "@/providers/TenantProvider";
import { getTenantLink, getTenantUrl } from "@/lib/tenant-utils";

/**
 * Hook to generate links for the current tenant.
 * Automatically detects if the user is accessing via subdomain or path.
 */
export const useTenantLink = () => {
    const { tenant } = useTenant();

    const getLink = (path: string) => {
        return getTenantLink(path, tenant?.slug);
    };

    const storeUrl = getTenantUrl(tenant?.slug);

    return { getLink, storeUrl, slug: tenant?.slug };
};
