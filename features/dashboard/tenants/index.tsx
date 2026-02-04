"use client";

import { useState } from "react";

import Link from "next/link";

import { Check, Copy, Edit, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";

import { useFetchTenants } from "@/hooks/admin/useFetchTenants";
import { useToggleTenant } from "@/hooks/admin/useToggleTenant";

export default function TenantsListPage() {
  const { data: tenants, isLoading } = useFetchTenants();
  const toggleMutation = useToggleTenant();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (slug: string, id: string) => {
    const url = `${window.location.origin}/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("URL copiada al portapapeles");
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await toggleMutation.mutateAsync({
        id,
        is_active: !currentStatus,
      });
      toast.success(!currentStatus ? "Tienda activada" : "Tienda desactivada");
    } catch (error: any) {
      toast.error(error.message || "Error al cambiar estado");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <p>Cargando tenants...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Flex className="mb-8 items-center justify-between">
        <h1 className="text-3xl font-bold">Gestión de Tiendas</h1>
        <Link href="/admin/dashboard/tenants/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Tienda
          </Button>
        </Link>
      </Flex>

      <div className="grid gap-4">
        {!tenants || tenants.length === 0 ? (
          <p className="text-muted-foreground">No hay tiendas creadas</p>
        ) : (
          tenants.map((tenant: any) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">{tenant.name}</h3>
                  <span
                    className={
                      tenant.is_active
                        ? "rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                        : "rounded-full bg-red-100 px-2 py-1 text-xs text-red-800"
                    }
                  >
                    {tenant.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Slug:{" "}
                  <code className="rounded bg-muted px-1">{tenant.slug}</code>
                </p>
                <p className="text-sm text-muted-foreground">
                  WhatsApp: {tenant.whatsapp_number}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(tenant.slug, tenant.id)}
                >
                  {copiedId === tenant.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>

                <Button
                  variant={tenant.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleActive(tenant.id, tenant.is_active)}
                  disabled={toggleMutation.isPending}
                >
                  {tenant.is_active ? "Desactivar" : "Activar"}
                </Button>

                <Link href={`/admin/dashboard/tenants/edit/${tenant.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
