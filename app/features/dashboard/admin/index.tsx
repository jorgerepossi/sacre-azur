import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Panel de Super Administrador</h1>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/admin/dashboard/tenants">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white">
            <h3 className="text-xl font-semibold mb-2">🏪 Gestión de Tiendas</h3>
            <p className="text-muted-foreground">Crear y administrar tenants</p>
          </div>
        </Link>
      </div>
    </div>
  );
}