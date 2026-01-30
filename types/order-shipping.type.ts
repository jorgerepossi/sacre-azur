export interface OrderShipping {
  id: string;
  order_id: string;

  // Dirección
  shipping_address?: string;
  shipping_province?: string;
  shipping_city?: string;
  shipping_postal_code?: string;

  // Detalles del envío
  shipping_method?: "CORREO_ARGENTINO" | "ANDREANI" | "RETIRO_PERSONAL";
  shipping_cost?: number;
  tracking_number?: string;
  tracking_url?: string;

  // Notas internas
  internal_notes?: string;

  // Timestamps
  created_at: string;
  updated_at: string;
}

export const SHIPPING_METHODS = {
  CORREO_ARGENTINO: {
    label: "Correo Argentino",
    trackingUrl: (code: string) =>
      `https://www.correoargentino.com.ar/formularios/e-commerce?codigo=${code}`,
  },
  ANDREANI: {
    label: "Andreani",
    trackingUrl: (code: string) =>
      `https://www.andreani.com/#!/informacionEnvio/${code}`,
  },
  RETIRO_PERSONAL: {
    label: "Retiro Personal",
    trackingUrl: null,
  },
} as const;
