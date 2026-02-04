import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

// Solo owner puede acceder
async function checkOwnerAccess() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== "sudacadev@gmail.com") {
    return false;
  }

  return true;
}

// GET - Listar todos los tenants
export async function GET() {
  try {
    const isOwner = await checkOwnerAccess();
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST - Crear tenant
export async function POST(request: Request) {
  try {
    const isOwner = await checkOwnerAccess();
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { name, slug, whatsapp_number, primary_color, secondary_color } =
      body;

    // Validaciones
    if (!name || !slug || !whatsapp_number) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!whatsapp_number.startsWith("+")) {
      return NextResponse.json(
        { error: "WhatsApp number must start with +" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verificar slug único
    const { data: existing } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 },
      );
    }

    // Crear tenant
    const { data, error } = await supabase
      .from("tenants")
      .insert({
        name,
        slug,
        whatsapp_number,
        primary_color: primary_color || "#000000",
        secondary_color: secondary_color || "#ffffff",
        is_active: true,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating tenant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
