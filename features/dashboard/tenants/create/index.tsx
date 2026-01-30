"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { supabase } from "@/lib/supabaseClient";

export default function CreateTenantContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    whatsapp_number: "",
    primary_color: "#000000",
    secondary_color: "#ffffff",
  });

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
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validar slug único
    const { data: existing } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", formData.slug)
      .single();

    if (existing) {
      toast.error("Ya existe una tienda con ese slug");
      setLoading(false);
      return;
    }

    // Validar formato de WhatsApp
    if (!formData.whatsapp_number.startsWith("+")) {
      toast.error(
        "El número de WhatsApp debe empezar con + (ej: +5491112345678)",
      );
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("tenants")
      .insert({
        name: formData.name,
        slug: formData.slug,
        whatsapp_number: formData.whatsapp_number,
        primary_color: formData.primary_color,
        secondary_color: formData.secondary_color,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating tenant:", error);
      toast.error("Error al crear la tienda");
    } else {
      toast.success("Tienda creada exitosamente");
      router.push("/dashboard/tenants");
    }

    setLoading(false);
  };

  return (
    <div className="container max-w-xl py-10">
      <Link
        href="/dashboard/tenants"
        className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Volver a tiendas
      </Link>

      <h1 className="mb-8 text-3xl font-bold">Crear Nueva Tienda</h1>

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
            <span className="whitespace-nowrap text-sm text-muted-foreground">
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
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Creando..." : "Crear Tienda"}
          </Button>
        </Flex>
      </form>

      <div className="mt-8 rounded-lg bg-muted p-4">
        <h3 className="mb-2 font-semibold">Preview de la URL:</h3>
        <code className="text-sm">
          https://\{formData.slug || "mi-tienda"}.sacreazur.vercel.app
        </code>
      </div>
    </div>
  );
}
