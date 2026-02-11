"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { encodedRedirect } from "@/utils/utils";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const tenantName =
    formData.get("tenantName")?.toString() ||
    email?.split("@")[0] ||
    "My Store";
  const productType = (formData.get("productType")?.toString() || "decant") as "decant" | "perfume";
  const whatsappNumber = formData.get("whatsappNumber")?.toString() || "+54";

  const supabase = await createClient();       // Para auth
  const supabaseAdmin = createAdminClient();   // Para inserts (bypasea RLS)
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect("error", "/signup", "Email and password are required");
  }

  // 1. Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (authError) {
    console.error(authError.code + " " + authError.message);
    return encodedRedirect("error", "/signup", authError.message);
  }

  if (!authData.user) {
    return encodedRedirect("error", "/signup", "User creation failed");
  }

  // 2. Crear tenant con admin client (bypasea RLS)
  const tenantSlug = tenantName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { data: tenantData, error: tenantError } = await supabaseAdmin
    .from("tenants")
    .insert([
      {
        name: tenantName,
        slug: tenantSlug,
        is_active: true,
        product_type: productType,
        whatsapp_number: whatsappNumber,
      },
    ])
    .select()
    .single();

  if (tenantError) {
    console.error("Tenant creation error:", tenantError);
    return encodedRedirect("error", "/signup", `Store creation failed: ${tenantError.message || "Unknown error"}`);
  }

  // 3. Asociar usuario con tenant con admin client (bypasea RLS)
  const { error: tenantUserError } = await supabaseAdmin
    .from("tenant_users")
    .insert([
      {
        user_id: authData.user.id,
        tenant_id: tenantData.id,
        role: "admin",
      },
    ]);

  if (tenantUserError) {
    console.error("Tenant user association error:", tenantUserError);
    return encodedRedirect("error", "/signup", `User association failed: ${tenantUserError.message || "Unknown error"}`);
  }

  /**
   * 
   * 
  return encodedRedirect(
    "success",
    "/signup",
    "Thanks for signing up! Please check your email for a verification link.",
  );
   */
  return redirect(`/${tenantSlug}/dashboard`);
};