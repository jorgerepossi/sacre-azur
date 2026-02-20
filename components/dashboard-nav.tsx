"use client";

import Link from "next/link";

import { Key, LockKeyhole } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { Button } from "@/components/ui/button";

import { useUserRole } from "@/hooks/useUserRole";

interface DashboardNavProps {
  tenant: string;
}

export function DashboardNav({ tenant }: DashboardNavProps) {
  const { isOwner, isAdmin, isSuperAdmin, isTenant, loading } = useUserRole();

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
            <Link href={`/${tenant}`} target="_blank">
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
            <Link href={`/${tenant}/dashboard`}>
              <Button variant="ghost" size="sm">
                Inicio
              </Button>
            </Link>
            {/* Todos los roles */}
            <Link href={`/${tenant}/dashboard/perfumes`}>
              <Button variant="ghost" size="sm">
                Perfumes
              </Button>
            </Link>

            <Link href={`/${tenant}/dashboard/orders`}>
              <Button variant="ghost" size="sm">
                Órdenes
              </Button>
            </Link>

            <Link href={`/${tenant}/dashboard/create`}>
              <Button variant="ghost" size="sm">
                + Nuevo Perfume
              </Button>
            </Link>

            {isOwner && (
              <Link href={`/${tenant}/dashboard/brands`}>
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <LockKeyhole size={12} /> Marcas
                </Button>
              </Link>
            )}

            {(isOwner || isAdmin || isSuperAdmin || isTenant) && (
              <Link href={`/${tenant}/dashboard/settings`}>
                <Button variant="ghost" size="sm" className="flex gap-2">
                  <LockKeyhole size={12} /> Configuración
                </Button>
              </Link>
            )}

            {isOwner && (
              <Link href={`/${tenant}/dashboard/users`}>
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
