"use client";

import { useParams } from "next/navigation";

export function useTenantUrl() {
  const params = useParams();
  const tenant = params?.tenant as string;

  const getUrl = (path: string) => {
    if (!tenant) return path;
    // Si el path ya tiene el tenant, no agregarlo de nuevo
    if (path.startsWith(`/${tenant}`)) return path;
    // Si el path empieza con /, agregamos el tenant
    if (path.startsWith("/")) return `/${tenant}${path}`;
    // Si no, agregamos tanto el tenant como la /
    return `/${tenant}/${path}`;
  };

  return { getUrl, tenant };
}
