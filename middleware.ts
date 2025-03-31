import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const isApiRoute = url.pathname.startsWith('/api');


  const allowedOrigins = [
    'https://sacre-azur.vercel.com',
    'http://localhost:3000',
    'https://localhost:3000'
  ].filter((origin): origin is string => Boolean(origin)); // Type Predicate

  // 2. Headers CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": allowedOrigins.join(', '),
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // 3. Manejar preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { 
      status: 204,
      headers: corsHeaders
    });
  }

  // 4. Validación para APIs
  if (isApiRoute) {
    // Asegurar valores no nulos
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';

    const isValidRequest = allowedOrigins.some(allowedOrigin => 
      origin.startsWith(allowedOrigin) || 
      referer.startsWith(allowedOrigin)
    );

    if (!isValidRequest) {
      return new NextResponse('Acceso no autorizado', {
        status: 403,
        headers: corsHeaders
      });
    }

    // 5. Bloquear navegador
    const isBrowserRequest = request.headers.get('accept')?.includes('text/html');
    if (isBrowserRequest) {
      return NextResponse.redirect(new URL('/', url.origin));
    }
  }

  // 6. Continuar con la lógica
  const response = await updateSession(request) || new NextResponse();
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