
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isFromBrowser = request.headers.get('accept')?.includes('text/html');
  const allowedOrigin =String( process.env.NEXT_PUBLIC_SITE_URL);


  if (isApiRoute && isFromBrowser) {
    return NextResponse.redirect(new URL('/', request.url));
  }


  if (isApiRoute) {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    const isValidApiRequest = origin === allowedOrigin ||
      (referer && referer.startsWith(allowedOrigin));

    if (!isValidApiRequest) {
      return new NextResponse('Acceso prohibido', { status: 403 });
    }
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };


  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders
    });
  }


  const response = await updateSession(request);
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