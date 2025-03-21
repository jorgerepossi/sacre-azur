import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Configurar encabezados CORS
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // ⚠️ Cambia esto en producción a un dominio específico
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  };

  // Manejar preflight request (CORS)
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  const response = await updateSession(request);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Configurar matcher para el middleware
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
