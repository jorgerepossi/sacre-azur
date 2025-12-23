"use client";

import NextLink, { LinkProps } from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, AnchorHTMLAttributes } from "react";

interface TenantLinkProps extends Omit<LinkProps, 'href'>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
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
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const isReserved = href.startsWith('/admin') || href.startsWith('/api') || href.startsWith('/auth');
  const hasTenant = tenant && href.startsWith(`/${tenant}`);
  
  let finalHref = href;
  
  if (!isExternal && !isReserved && !hasTenant && tenant) {
    // Agregar tenant al path
    finalHref = href.startsWith('/') ? `/${tenant}${href}` : `/${tenant}/${href}`;
  }

  return <NextLink href={finalHref} {...props}>{children}</NextLink>;
}