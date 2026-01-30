import { type NextRequest, NextResponse } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";

const RESERVED_PATHS = ["admin", "api", "auth", "_next", "favicon.ico"];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Extract first segment of path (potential tenant)
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] || null;

  const response = await updateSession(request);

  // If accessing root /, redirect to default tenant
  if (pathname === "/") {
    const defaultTenant = process.env.NEXT_PUBLIC_DEV_TENANT_SLUG || "demo";
    return NextResponse.redirect(new URL(`/${defaultTenant}`, request.url));
  }

  // If accessing reserved paths (admin, api, etc), no tenant needed
  if (firstSegment && RESERVED_PATHS.includes(firstSegment)) {
    // No tenant for these routes
    return response;
  }

  // Otherwise, first segment is the tenant
  if (firstSegment) {
    response.headers.set("x-tenant-slug", firstSegment);
  }

  // CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, x-tenant-slug",
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
