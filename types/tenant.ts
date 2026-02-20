export type ProductType = 'decant' | 'perfume';

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  logo_url: string | null;
  whatsapp_number: string;
  primary_color: string;
  secondary_color: string;
  currency: string;
  is_active: boolean;
  product_type: ProductType;
  decant_min_size: number;
  has_1_2ml_option: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: "owner" | "admin" | "viewer";
  created_at: string;
}

export interface TenantContext {
  tenant: Tenant | null;
  isLoading: boolean;
  error: string | null;
}

export interface CreateTenantInput {
  slug: string;
  name: string;
  whatsapp_number: string;
  product_type?: ProductType;
  logo_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  currency?: string;
  decant_min_size?: number;
  has_1_2ml_option?: boolean;
}
