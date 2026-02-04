"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("¡Bienvenido!");

      // Obtener tenant del usuario
      const { data: tenantUser } = await supabase
        .from("tenant_users")
        .select("tenant_id, tenants(slug)")
        .eq("user_id", data.user.id)
        .single();

      if (tenantUser) {
        const slug = (tenantUser.tenants as any).slug;
        router.push(`/${slug}/dashboard`);
        router.refresh();
      } else {
        toast.error("No se encontró tenant para este usuario");
      }
    } catch (error: any) {
      toast.error(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Iniciar Sesión</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Ingresá a tu dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tenés cuenta?{" "}
          <a
            href="/signup"
            className="font-medium text-primary hover:underline"
          >
            Registrate
          </a>
        </p>
      </Card>
    </div>
  );
}
