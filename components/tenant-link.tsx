"use client";

import { AnchorHTMLAttributes, ReactNode } from "react";
import NextLink, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { BASE_DOMAIN } from "@/lib/config";

interface TenantLinkProps
  extends Omit<LinkProps, "href">,
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  children: ReactNode;
}

export function Link({ href, children, ...props }: TenantLinkProps) {
  const params = useParams();
  const tenant = params?.tenant as string | undefined;

  // No modificar si:
  // - Es una URL externa (http/https)
  // - Ya tiene el tenant
  // - Es una ruta de admin/api/auth
  const isExternal = href.startsWith("http") || href.startsWith("//");
  const isReserved =
    href.startsWith("/admin") ||
    href.startsWith("/api") ||
    href.startsWith("/auth") ||
    href.startsWith("/sign-in") ||
    href.startsWith("/sign-up") ||
    href.startsWith("/login") ||
    href.startsWith("/signup") ||
    href.startsWith("/unauthorized") ||
    href.startsWith("/404");

  const hasTenant = tenant && href.startsWith(`/${tenant}`);

  let finalHref = href;

  if (!isExternal && !isReserved && !hasTenant && tenant) {
    let isSubdomain = false;

    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      isSubdomain =
        hostname.endsWith(`.${BASE_DOMAIN}`) &&
        hostname !== BASE_DOMAIN &&
        hostname !== `www.${BASE_DOMAIN}`;
    }

    if (!isSubdomain) {
      // Agregar tenant al path solo si NO estamos en un subdominio
      finalHref = href.startsWith("/")
        ? `/${tenant}${href}`
        : `/${tenant}/${href}`;
    }
  }

  return (
    <NextLink href={finalHref} {...props}>
      {children}
    </NextLink>
  );
}
