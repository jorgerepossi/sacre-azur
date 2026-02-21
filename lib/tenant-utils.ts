/**
 * Utility to generate a tenant-aware link.
 * 
 * If we are on a subdomain (e.g., tenant.domain.com), it returns the path directly (e.g., /dashboard).
 * If we are on path-based routing (e.g., domain.com/tenant), it prepends the slug (e.g., /tenant/dashboard).
 */
export const getTenantLink = (path: string, slug: string | undefined) => {
    if (!slug) return path;

    // Ensure path starts with /
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;
        const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "defragancias.com";

        // Detect if we are currently on a subdomain
        const hostParts = hostname.split('.');
        const isSubdomain =
            (hostname.endsWith(`.${baseDomain}`) && hostname !== baseDomain && hostname !== `www.${baseDomain}`) ||
            (hostname.includes("localhost") && hostParts.length > 1 && !hostname.startsWith("localhost"));

        if (isSubdomain) {
            return cleanPath;
        }
    }

    // Fallback or path-based routing
    return `/${slug}${cleanPath}`;
};


export const getTenantUrl = (slug: string | undefined) => {
    if (!slug) return "/";
    const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "defragancias.com";
    const protocol = baseDomain.includes("localhost") ? "http" : "https";
    return `${protocol}://${slug}.${baseDomain}`;
};