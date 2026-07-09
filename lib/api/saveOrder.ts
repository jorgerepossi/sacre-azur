import { getBaseUrl } from "@/lib/config";

// El precio NO viaja desde acá: el server recalcula price/stock desde
// tenant_products antes de grabar la orden, así que el cliente solo
// manda qué está pidiendo, no cuánto vale.
export const saveOrder = async (
  items: { id: string; name: string; size: number; quantity: number }[],
  tenantSlug: string,
  customerName?: string,
  customerPhone?: string,
) => {
  const response = await fetch(`${getBaseUrl()}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-tenant-slug": tenantSlug,
    },
    body: JSON.stringify({
      customerName: customerName || null,
      customerPhone: customerPhone || null,
      items,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Error saving order");
  }

  const data = await response.json();
  return data.order_code as string;
};
