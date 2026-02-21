import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/utils/supabase/middleware";

const RESERVED_PATHS = [
  "admin",
  "api",
  "auth",
  "_next",
  "favicon.ico",
  "login",
  "signup",
  "sign-in",
  "sign-up",
  "unauthorized",
  "404",
  ".well-known",
  "order-confirmed",
];

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const hostname = request.headers.get("host") || "";
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "defragancias.com";


  let subdomain: string | null = null;
  const hostParts = hostname.split('.');

  if (
    hostname.includes(baseDomain) &&
    hostname !== baseDomain &&
    hostname !== `www.${baseDomain}`
  ) {
    // Production subdomain detection
    const baseDomainPartsCount = baseDomain.split('.').length;
    if (hostParts.length > baseDomainPartsCount) {
      subdomain = hostParts[0];
    }
  } else if (
    hostname.includes("localhost") &&
    hostParts.length > 1 &&
    !hostname.startsWith("localhost")
  ) {
    // Local development subdomain detection (e.g., demo.localhost:3000)
    subdomain = hostParts[0];
  }

  // Pre-process response to add session
  const response = await updateSession(request);

  // If we have a subdomain, we rewrite but ALSO need to set the tenant header
  if (subdomain) {
    response.headers.set("x-tenant-slug", subdomain);

    // Check if this is a reserved path on the subdomain
    const isReserved = RESERVED_PATHS.some(p => pathname === `/${p}` || pathname.startsWith(`/${p}/`));

    if (!isReserved && !pathname.startsWith(`/${subdomain}/`) && pathname !== `/${subdomain}`) {
      const newPath = `/${subdomain}${pathname}`;
      const rewriteUrl = new URL(newPath, request.url);
      rewriteUrl.search = url.search;
      // We return a rewrite but we MUST preserve the headers we set on 'response'
      // Next.js middleware allows returning a response with a rewrite "header" or using NextResponse.rewrite
      const rewriteResponse = NextResponse.rewrite(rewriteUrl);
      // Transfer headers and cookies from the updated session response
      response.headers.forEach((value, key) => rewriteResponse.headers.set(key, value));
      return rewriteResponse;
    }
  }

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] || null;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {  // ← AGREGAR TIPO
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ✅ PERMITIR QUE "/" PASE SIN REDIRECT
  if (pathname === "/") {
    return response;
  }

  if (firstSegment && RESERVED_PATHS.includes(firstSegment)) {
    if (pathname === "/sign-in" && user) {
      const { data: tenantUser } = await supabase
        .from("tenant_users")
        .select("tenants(slug)")
        .eq("user_id", user.id)
        .single();

      if (tenantUser) {
        const slug = (tenantUser.tenants as any).slug;
        const targetUrl = subdomain
          ? new URL(`/dashboard`, request.url)
          : new URL(`/${slug}/dashboard`, request.url);
        return NextResponse.redirect(targetUrl);
      }
    }
    return response;
  }

  // Otherwise, first segment is the tenant (for path-based)
  if (!subdomain && firstSegment) {
    const { data: tenant } = await supabase
      .from("tenants")
      .select("id, slug, is_active")
      .eq("slug", firstSegment)
      .single();

    if (!tenant) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    if (!tenant.is_active) {
      return NextResponse.redirect(new URL("/404", request.url));
    }

    response.headers.set("x-tenant-slug", firstSegment);
  }

  // PROTEGER RUTAS DEL DASHBOARD (Tanto en subdominio como en path-based)
  const isDashboardPath = pathname.includes("/dashboard");
  const activeSlug = subdomain || (!RESERVED_PATHS.includes(firstSegment!) ? firstSegment : null);

  if (isDashboardPath && activeSlug) {
    if (!user) {
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const { data: tenantAccess } = await supabase
      .from("tenant_users")
      .select("tenant_id, tenants(slug)")
      .eq("user_id", user.id)
      .single();

    if (
      !tenantAccess ||
      (tenantAccess.tenants as any)?.slug !== activeSlug
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
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