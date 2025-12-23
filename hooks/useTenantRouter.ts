"use client";

import { useRouter as useNextRouter, useParams } from "next/navigation";

export function useRouter() {
  const router = useNextRouter();
  const params = useParams();
  const tenant = params?.tenant as string | undefined;

  const push = (href: string, options?: any) => {
    const isExternal = href.startsWith('http') || href.startsWith('//');
    const isReserved = href.startsWith('/admin') || href.startsWith('/api') || href.startsWith('/auth');
    const hasTenant = tenant && href.startsWith(`/${tenant}`);
    
    let finalHref = href;
    
    if (!isExternal && !isReserved && !hasTenant && tenant) {
      // Separar path y query params
      const [path, query] = href.split('?');
      const tenantPath = path.startsWith('/') ? `/${tenant}${path}` : `/${tenant}/${path}`;
      finalHref = query ? `${tenantPath}?${query}` : tenantPath;
    }
    
    return router.push(finalHref, options);
  };

  return {
    ...router,
    push,
  };
}