"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Tenant } from "@/types/tenant";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Copy, Check, Edit } from "lucide-react";
import Flex from "@/components/flex";
import { TENANT_URL } from "./constants";

export default function TenantsListContent() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    const { data, error } = await supabase
      .from("tenants")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tenants:", error);
    } else {
      setTenants(data || []);
    }
    setLoading(false);
  };

  const copyToClipboard = async (slug: string, id: string) => {
    const url = "https://" + slug + ".sacreazur.vercel.app";
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleActive = async (tenant: Tenant) => {
    const { error } = await supabase
      .from("tenants")
      .update({ is_active: !tenant.is_active })
      .eq("id", tenant.id);

    if (!error) {
      fetchTenants();
    }
  };

  if (loading) {
    return (
      <div className="container py-10">
        <p>Cargando tenants...</p>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Flex className="items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Gestión de Tiendas</h1>
        <Link href={`/${TENANT_URL.AMIN}/${TENANT_URL.DASHBOARD}/tenants/create`}>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Tienda
          </Button>
        </Link>
      </Flex>

      <div className="grid gap-4">
        {tenants.length === 0 ? (
          <p className="text-muted-foreground">No hay tiendas creadas</p>
        ) : (
          tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{tenant.name}</h3>
                  <span
                    className={
                      tenant.is_active
                        ? "px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                        : "px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
                    }
                  >
                    {tenant.is_active ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Slug: <code className="bg-muted px-1 rounded">{tenant.slug}</code>
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
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  variant={tenant.is_active ? "destructive" : "default"}
                  size="sm"
                  onClick={() => toggleActive(tenant)}
                >
                  {tenant.is_active ? "Desactivar" : "Activar"}
                </Button>
                <Link href={`/${TENANT_URL.AMIN}/${TENANT_URL.DASHBOARD}//tenants/edit/${tenant.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
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
