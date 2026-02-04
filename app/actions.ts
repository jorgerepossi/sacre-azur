"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { encodedRedirect } from "@/utils/utils";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const tenantName =
    formData.get("tenantName")?.toString() ||
    email?.split("@")[0] ||
    "My Store";

  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
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
    return encodedRedirect("error", "/sign-up", authError.message);
  }

  if (!authData.user) {
    return encodedRedirect("error", "/sign-up", "User creation failed");
  }

  // 2. Crear tenant (slug basado en email o nombre)
  const tenantSlug = tenantName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { data: tenantData, error: tenantError } = await supabase
    .from("tenants")
    .insert([
      {
        name: tenantName,
        slug: tenantSlug,
        active: true,
      },
    ])
    .select()
    .single();

  if (tenantError) {
    console.error("Tenant creation error:", tenantError);
    // Si falla, eliminar el usuario creado (opcional)
    await supabase.auth.admin.deleteUser(authData.user.id);
    return encodedRedirect("error", "/sign-up", "Store creation failed");
  }

  // 3. Asociar usuario con tenant
  const { error: tenantUserError } = await supabase
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
    return encodedRedirect("error", "/sign-up", "User association failed");
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  // Obtener tenant del usuario y redirigir a su dashboard
  const { data: tenantUser } = await supabase
    .from("tenant_users")
    .select("tenants(slug)")
    .eq("user_id", data.user.id)
    .single();

  if (tenantUser && tenantUser.tenants) {
    const slug = (tenantUser.tenants as any).slug;
    return redirect(`/${slug}/dashboard`);
  }

  // Fallback si no tiene tenant
  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect(
    "success",
    "/protected/reset-password",
    "Password updated",
  );
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
