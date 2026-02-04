import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

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

// GET - Obtener tenant por ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isOwner = await checkOwnerAccess();
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching tenant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT - Actualizar tenant
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    console.log("🔍 Starting PUT request");

    const isOwner = await checkOwnerAccess();
    console.log("🔑 Owner check:", isOwner);

    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    console.log("📝 Tenant ID:", id);

    const body = await request.json();
    console.log("📦 Request body:", body);

    const { name, slug, whatsapp_number, primary_color, secondary_color } =
      body;

    if (!whatsapp_number.startsWith("+")) {
      return NextResponse.json(
        { error: "WhatsApp number must start with +" },
        { status: 400 },
      );
    }

    const supabase = await createClient();

    // Verificar slug único (excepto el actual)
    console.log("🔍 Checking slug uniqueness...");
    const { data: existing } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single();

    if (existing) {
      console.log("❌ Slug already exists");
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 },
      );
    }

    console.log("💾 Updating tenant...");
    const { data, error } = await supabase
      .from("tenants")
      .update({
        name,
        slug,
        whatsapp_number,
        primary_color,
        secondary_color,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      throw error;
    }

    console.log("✅ Update successful:", data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("💥 Error updating tenant:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}

// PATCH - Toggle active status
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isOwner = await checkOwnerAccess();
    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { is_active } = await request.json();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tenants")
      .update({ is_active })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error toggling tenant:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
