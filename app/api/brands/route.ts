import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // TODAS las marcas (globales)
    const { data, error } = await supabase
      .from("brand")
      .select("id, name, slug, active, image")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Error fetching brands" },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
