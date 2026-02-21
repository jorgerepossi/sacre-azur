"use client";

import Link from "next/link";

import { Key, LockKeyhole } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

import { useUserRole } from "@/hooks/useUserRole";
import { useTenantLink } from "@/hooks/useTenantLink";

interface DashboardNavProps {
  tenant: string;
}

export function DashboardNav({ tenant }: DashboardNavProps) {
  const { isOwner, isAdmin, isSuperAdmin, isTenant, loading } = useUserRole();
  const { getLink, storeUrl } = useTenantLink();

  if (loading) {
    return <div className="h-10 animate-pulse rounded bg-muted" />;
  }

  return (
    <>
      {/* Header */}
      <div className="border-b bg-background text-foreground">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Tienda: {tenant}</p>
          </div>
          <div className="flex gap-2">
            <Link href={storeUrl} target="_blank">
              <Button variant="outline" size="sm">
                Ver Tienda
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>


      {/* Navigation */}
      <div className="border-b bg-background text-foreground">
        <div className="container py-2">
          <nav className="flex gap-4">
            <Link href={getLink("/dashboard")}>
              <Button variant="ghost" size="sm">
                Inicio
              </Button>
            </Link>
            {/* Todos los roles */}
            <Link href={getLink("/dashboard/perfumes")}>
              <Button variant="ghost" size="sm">
                Perfumes
              </Button>
            </Link>

            <Link href={getLink("/dashboard/orders")}>
              <Button variant="ghost" size="sm">
                Órdenes
              </Button>
            </Link>

            <Link href={getLink("/dashboard/create")}>
              <Button variant="ghost" size="sm">
                + Nuevo Perfume
              </Button>
            </Link>

            {isSuperAdmin && (
              <Link href={getLink("/dashboard/brands")}>
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <LockKeyhole size={12} /> Marcas
                </Button>
              </Link>
            )}

            {(isOwner || isAdmin || isSuperAdmin || isTenant) && (
              <Link href={getLink("/dashboard/settings")}>
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <LockKeyhole size={12} /> Configuración
                </Button>
              </Link>
            )}

            {isSuperAdmin && (
              <Link href={getLink("/dashboard/users")}>
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <LockKeyhole size={12} /> Usuarios
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
