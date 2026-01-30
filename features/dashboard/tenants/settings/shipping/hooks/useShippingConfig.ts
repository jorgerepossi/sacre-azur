import { useEffect, useState } from "react";

import { useTenant } from "@/providers/TenantProvider";
import { toast } from "react-hot-toast";

import { supabase } from "@/lib/supabaseClient";

export const useShippingConfig = () => {
  const { tenant } = useTenant();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    correo_argentino_enabled: false,
    correo_argentino_username: "",
    correo_argentino_password: "",
    correo_argentino_account_number: "",
    origin_province: "",
    origin_city: "",
    origin_postal_code: "",
    origin_address: "",
  });

  useEffect(() => {
    loadConfig();
  }, [tenant?.id]);

  const loadConfig = async () => {
    if (!tenant?.id) return;

    try {
      const { data, error } = await supabase
        .from("tenant_shipping_config")
        .select("*")
        .eq("tenant_id", tenant.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setConfig({
          correo_argentino_enabled: data.correo_argentino_enabled || false,
          correo_argentino_username: data.correo_argentino_username || "",
          correo_argentino_password: data.correo_argentino_password || "",
          correo_argentino_account_number:
            data.correo_argentino_account_number || "",
          origin_province: data.origin_province || "",
          origin_city: data.origin_city || "",
          origin_postal_code: data.origin_postal_code || "",
          origin_address: data.origin_address || "",
        });
      }
    } catch (error) {
      console.error("Error loading config:", error);
      toast.error("Error al cargar configuración");
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    if (!tenant?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("tenant_shipping_config").upsert({
        tenant_id: tenant.id,
        ...config,
      });

      if (error) throw error;

      toast.success("Configuración guardada");
    } catch (error) {
      console.error("Error saving config:", error);
      toast.error("Error al guardar configuración");
    } finally {
      setSaving(false);
    }
  };

  return {
    config,
    setConfig,
    loading,
    saving,
    saveConfig,
  };
};
