"use client";

import { useRouter } from "next/navigation";

import { LogOut } from "lucide-react";
import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Sesión cerrada");
      router.push("/sign-in");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error al cerrar sesión");
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Cerrar Sesión
    </Button>
  );
}
