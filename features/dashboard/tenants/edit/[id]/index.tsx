"use client";

import { use, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useFetchTenant } from "@/hooks/admin/useFetchTenant";
import { useUpdateTenant } from "@/hooks/admin/useUpdateTenant";

export default function EditTenantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: tenant, isLoading } = useFetchTenant(id);
  const updateMutation = useUpdateTenant(id);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    whatsapp_number: "",
    primary_color: "#000000",
    secondary_color: "#ffffff",
  });

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        slug: tenant.slug,
        whatsapp_number: tenant.whatsapp_number,
        primary_color: tenant.primary_color || "#000000",
        secondary_color: tenant.secondary_color || "#ffffff",
      });
    }
  }, [tenant]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.whatsapp_number.startsWith("+")) {
      toast.error(
        "El número de WhatsApp debe empezar con + (ej: +5491112345678)",
      );
      return;
    }

    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Tienda actualizada exitosamente");
      router.push("/admin/dashboard/tenants");
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar la tienda");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <p>Cargando datos de la tienda...</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="container py-10">
        <p>Tienda no encontrada</p>
      </div>
    );
  }

  return (
    <div className="container max-w-xl py-10">
      <Link
        href="/admin/dashboard/tenants"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Volver a tiendas
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Editar Tienda</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la tienda *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Mi Perfumería"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL) *</Label>
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
                className="h-10 w-10 cursor-pointer rounded"
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
                className="h-10 w-10 cursor-pointer rounded"
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
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex-1"
          >
            {updateMutation.isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </Flex>
      </form>

      <div className="mt-8 rounded-lg bg-muted p-4">
        <h3 className="mb-2 font-semibold">Preview de la URL:</h3>
        <code className="text-sm">
          {typeof window !== "undefined" && window.location.origin}/
          {formData.slug || "mi-tienda"}
        </code>
      </div>
    </div>
  );
}
