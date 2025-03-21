"use client";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function DeletePoliciesButton() {
    const deletePolicies = useMutation({
        mutationFn: async () => {
            // 1️⃣ Desactivar Row Level Security (RLS)
            let { error } = await supabase.rpc("set_rls", { table_name: "perfume", enabled: false });
            if (error) throw new Error("Error desactivando RLS: " + error.message);

            // 2️⃣ Borrar todas las policies de `perfume`
            const { error: policyError } = await supabase.rpc("delete_all_policies", { table_name: "perfume" });
            if (policyError) throw new Error("Error eliminando policies: " + policyError.message);

            return "Policies eliminadas y RLS desactivado";
        },
        onSuccess: () => {
            alert("Todas las policies de seguridad fueron eliminadas de la tabla 'perfume'. Intenta insertar nuevamente.");
        },
        onError: (error) => {
            console.error("Error eliminando policies:", error);
            alert("Hubo un error eliminando las policies.");
        },
    });

    return (
        <Button onClick={() => deletePolicies.mutate()} disabled={deletePolicies.isPending}>
            {deletePolicies.isPending ? "Borrando Policies..." : "Eliminar Policies de Perfume"}
        </Button>
    );
}
