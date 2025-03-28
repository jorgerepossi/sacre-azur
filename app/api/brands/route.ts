import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("brand")
      .select("id, name, active, image")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Error fetching brands" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=3600",
        "CDN-Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
