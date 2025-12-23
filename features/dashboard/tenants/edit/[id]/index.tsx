"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import Flex from "@/components/flex";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EditTenantContentProps {
  tenantId: string;
}

export default function EditTenantContent({ tenantId }: EditTenantContentProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    whatsapp_number: "",
    primary_color: "#000000",
    secondary_color: "#ffffff",
  });

  useEffect(() => {
    fetchTenant();
  }, [tenantId]);

  const fetchTenant = async () => {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single();

    if (error || !data) {
      toast.error("Error al cargar la tienda");
      console.error("Error fetching tenant:", error);
    } else {
      setFormData({
        name: data.name,
        slug: data.slug,
        whatsapp_number: data.whatsapp_number,
        primary_color: data.primary_color || "#000000",
        secondary_color: data.secondary_color || "#ffffff",
      });
    }
    setFetching(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validar slug único (excepto el actual)
    const { data: existing } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", formData.slug)
      .neq("id", tenantId)
      .single();

    if (existing) {
      toast.error("Ya existe otra tienda con ese slug");
      setLoading(false);
      return;
    }

    // Validar formato de WhatsApp
    if (!formData.whatsapp_number.startsWith("+")) {
      toast.error("El número de WhatsApp debe empezar con + (ej: +5491112345678)");
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from("tenants")
      .update({
        name: formData.name,
        slug: formData.slug,
        whatsapp_number: formData.whatsapp_number,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
      })
      .eq("id", tenantId);

    if (error) {
      console.error("Error updating tenant:", error);
      toast.error("Error al actualizar la tienda");
    } else {
      toast.success("Tienda actualizada exitosamente");
      router.push("/dashboard/tenants");
    }

    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="container py-10">
        <p>Cargando datos de la tienda...</p>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-xl">
      <Link href="/dashboard/tenants" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Volver a tiendas
      </Link>

      <h1 className="text-3xl font-bold mb-8">Editar Tienda</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la tienda *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleNameChange}
            placeholder="Mi Perfumería"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (subdominio) *</Label>
          <div className="flex items-center gap-2">
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value.toLowerCase() })
              }
              placeholder="mi-perfumeria"
              required
            />
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              .sacreazur.vercel.app
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Solo letras minúsculas, números y guiones
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">Número de WhatsApp *</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp_number}
            onChange={(e) =>
              setFormData({ ...formData, whatsapp_number: e.target.value })
            }
            placeholder="+5491112345678"
            required
          />
          <p className="text-xs text-muted-foreground">
            Formato internacional con código de país (ej: +54 para Argentina)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Color primario</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="primary_color"
                value={formData.primary_color}
                onChange={(e) =>
                  setFormData({ ...formData, primary_color: e.target.value })
                }
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={formData.primary_color}
                onChange={(e) =>
                  setFormData({ ...formData, primary_color: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_color">Color secundario</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="secondary_color"
                value={formData.secondary_color}
                onChange={(e) =>
                  setFormData({ ...formData, secondary_color: e.target.value })
                }
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={formData.secondary_color}
                onChange={(e) =>
                  setFormData({ ...formData, secondary_color: e.target.value })
                }
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <Flex className="gap-4 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Flex>
      </form>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Preview de la URL:</h3>
        <code className="text-sm">
          https://{formData.slug || "mi-tienda"}.sacreazur.vercel.app
        </code>
      </div>
    </div>
  );
}