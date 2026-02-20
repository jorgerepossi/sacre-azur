import { useEffect, useState } from "react";
import { useTenant } from "@/providers/TenantProvider";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabaseClient";

export const useGeneralSettings = () => {
    const { tenant } = useTenant();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState({
        decant_min_size: 2.5,
        has_1_2ml_option: false,
        name: "",
        whatsapp_number: "",
    });

    useEffect(() => {
        if (tenant) {
            setConfig({
                decant_min_size: tenant.decant_min_size || 2.5,
                has_1_2ml_option: tenant.has_1_2ml_option || false,
                name: tenant.name || "",
                whatsapp_number: tenant.whatsapp_number || "",
            });
            setLoading(false);
        }
    }, [tenant]);

    const saveConfig = async () => {
        if (!tenant?.id) return;

        setSaving(true);
        try {
            const { error } = await supabase
                .from("tenants")
                .update({
                    decant_min_size: config.decant_min_size,
                    has_1_2ml_option: config.has_1_2ml_option,
                    name: config.name,
                    whatsapp_number: config.whatsapp_number,
                })
                .eq("id", tenant.id);

            if (error) throw error;

            toast.success("Configuración guardada");
            // Optional: window.location.reload() or a context refresh to update branding/names
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
