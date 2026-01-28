import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TenantDashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TenantDashboardLayout({ 
  children, 
  params 
}: TenantDashboardLayoutProps) {
  const { tenant } = await params;

  // TODO: Aquí verificaremos autenticación después

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-background text-foreground">
        <div className="container py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Tienda: {tenant}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/${tenant}`}>
              <Button variant="outline" size="sm">
                Ver Tienda
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b bg-background text-foreground">
        <div className="container py-2">
          <nav className="flex gap-4">
            <Link href={`/${tenant}/dashboard`}>
              <Button variant="ghost" size="sm">
                Perfumes
              </Button>
            </Link>
            <Link href={`/${tenant}/dashboard/brands`}>
              <Button variant="ghost" size="sm">
                Marcas
              </Button>
            </Link>
            <Link href={`/${tenant}/dashboard/orders`}>
              <Button variant="ghost" size="sm">
                Órdenes
              </Button>
            </Link>
            <Link href={`/${tenant}/dashboard/create`}>
              <Button variant="ghost" size="sm">
                + Nuevo Perfume
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container py-8">
        {children}
      </div>
    </div>
  );
}