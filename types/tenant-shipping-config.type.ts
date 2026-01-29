export interface TenantShippingConfig {
  id: string;
  tenant_id: string;
  
 
  correo_argentino_enabled: boolean;
  correo_argentino_username?: string;
  correo_argentino_password?: string;
  correo_argentino_account_number?: string;
  
 
  andreani_enabled: boolean;
  andreani_username?: string;
  andreani_password?: string;
  andreani_client_id?: string;
  
 
  origin_province?: string;
  origin_city?: string;
  origin_postal_code?: string;
  origin_address?: string;
  
  created_at: string;
  updated_at: string;
}

export interface CorreoArgentinoQuoteRequest {
  origin_postal_code: string;
  destination_postal_code: string;
  weight: number; // en gramos
  declared_value: number; // valor declarado en pesos
}

export interface CorreoArgentinoQuoteResponse {
  service_type: string;
  price: number;
  delivery_days: number;
}

export interface CorreoArgentinoLabelRequest {
  origin_address: string;
  origin_city: string;
  origin_province: string;
  origin_postal_code: string;
  destination_name: string;
  destination_address: string;
  destination_city: string;
  destination_province: string;
  destination_postal_code: string;
  destination_phone: string;
  weight: number;
  declared_value: number;
  items_description: string;
}