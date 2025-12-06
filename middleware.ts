import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const RESERVED_SUBDOMAINS = ['www', 'app', 'admin', 'api', 'localhost', 'sacre-azur'];

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  const response = await updateSession(request);
  
  // Check if client already sent x-tenant-slug header (from fetch)
  const existingTenantSlug = request.headers.get('x-tenant-slug');
  
  if (existingTenantSlug) {
    // Client sent the header, pass it through
    response.headers.set('x-tenant-slug', existingTenantSlug);
  } else {
    // No header from client, determine tenant from URL/hostname
    let tenantSlug: string | null = null;
    
    // 1. Check query param first (for dev/testing)
    const url = new URL(request.url);
    const tenantParam = url.searchParams.get('tenant');
    
    if (tenantParam) {
      tenantSlug = tenantParam;
    }
    // 2. Check if localhost -> use env default
    else if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      tenantSlug = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG || 'demo';
    }
    // 3. Check if it's a vercel.app domain without valid subdomain -> use default
    else if (hostname.includes('vercel.app') && RESERVED_SUBDOMAINS.includes(subdomain)) {
      tenantSlug = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG || 'demo';
    }
    // 4. Production with custom domain: use subdomain
    else if (!RESERVED_SUBDOMAINS.includes(subdomain) && subdomain !== hostname) {
      tenantSlug = subdomain;
    }
    // 5. Fallback to default
    else {
      tenantSlug = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG || 'demo';
    }
    
    if (tenantSlug) {
      response.headers.set('x-tenant-slug', tenantSlug);
    }
  }
  
  // CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, x-tenant-slug",
  };
  
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
