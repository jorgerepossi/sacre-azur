import { supabase } from "@/lib/supabaseClient";

export async function getTenantIdFromSlug(
    tenantSlug: string | null
): Promise<string | null> {
    if (!tenantSlug) return null;
    
    console.log('[getTenantIdFromSlug] Looking for slug:', tenantSlug);
    
    const { data, error } = await supabase
        .from('tenants')
        .select('id')
        .eq('slug', tenantSlug)
        .eq('is_active', true)
        .single();
    
    console.log('[getTenantIdFromSlug] Result:', data, 'Error:', error);
    
    if (error || !data) {
        console.error(`Tenant not found for slug: ${tenantSlug}`, error);
        return null;
    }
    
    return data.id;
}

export async function getTenantBySlug(tenantSlug: string | null) {
    if (!tenantSlug) return null;
    
    const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', tenantSlug)
        .eq('is_active', true)
        .single();
    
    if (error || !data) {
        return null;
    }
    
    return data;
}
