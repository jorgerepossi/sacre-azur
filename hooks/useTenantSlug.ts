import { headers } from 'next/headers';

export async function getTenantSlug(): Promise<string | null> {
    const headersList = await headers();
    const tenantSlug = headersList.get('x-tenant-slug');
    
    console.log('[getTenantSlug] Header x-tenant-slug:', tenantSlug);
    console.log('[getTenantSlug] NODE_ENV:', process.env.NODE_ENV);
    console.log('[getTenantSlug] DEV_TENANT_SLUG:', process.env.NEXT_PUBLIC_DEV_TENANT_SLUG);
    
    if (!tenantSlug && process.env.NODE_ENV === 'development') {
        return process.env.NEXT_PUBLIC_DEV_TENANT_SLUG || null;
    }
    
    return tenantSlug;
}
