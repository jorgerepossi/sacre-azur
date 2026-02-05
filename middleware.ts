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

  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0] || null;

  const response = await updateSession(request);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
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
        return NextResponse.redirect(
          new URL(`/${slug}/dashboard`, request.url),
        );
      }
    }
    return response;
  }

  // Otherwise, first segment is the tenant
  if (firstSegment) {
    const { data: tenant, error } = await supabase
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

    // PROTEGER RUTAS DEL DASHBOARD
    if (pathname.includes("/dashboard")) {
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
        (tenantAccess.tenants as any)?.slug !== firstSegment
      ) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
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