import BrandPageContent from "@/features/dashboard/brands";

import { requireOwner } from "@/lib/auth-helpers";

import { getTenantIdFromSlug } from "@/utils/tenantUtils";

export default async function BrandsPage({
  params,
}: {
  params: Promise<{ tenant: string }>; // ← Cambiar a Promise
}) {
  const { tenant } = await params; // ← Await params
  const tenantId = await getTenantIdFromSlug(tenant);

  if (!tenantId) {
    throw new Error("Tenant not found");
  }

  await requireOwner(tenantId);

  return <BrandPageContent />;
}
