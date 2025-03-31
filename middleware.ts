
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const isApiRoute = url.pathname.startsWith('/api');


  const isDevelopment = process.env.NODE_ENV === 'development';
  const allowedOrigin = isDevelopment
    ? String(process.env.NEXT_PUBLIC_API_BASE_LOCAL_URL)
    : String(process.env.NEXT_PUBLIC_SITE_URL);


  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };


  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders
    });
  }


  if (isApiRoute && !isDevelopment) {
    const origin = request.headers.get('origin');
    const isValidRequest = origin === allowedOrigin;

    if (!isValidRequest) {
      return new NextResponse('Acceso no autorizado', {
        status: 403,
        headers: corsHeaders
      });
    }
  }


  const isBrowserRequest = request.headers.get('accept')?.includes('text/html');
  if (isApiRoute && isBrowserRequest) {
    return NextResponse.redirect(new URL('/', url.origin));
  }


  let response = await updateSession(request);
  response = response || new NextResponse();


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