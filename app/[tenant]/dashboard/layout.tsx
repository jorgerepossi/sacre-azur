import { DashboardNav } from "@/components/dashboard-nav";

interface TenantDashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    tenant: string;
  }>;
}

export default async function TenantDashboardLayout({
  children,
  params,
}: TenantDashboardLayoutProps) {
  const { tenant } = await params;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardNav tenant={tenant} />
      <div className="container py-8">{children}</div>
    </div>
  );
}
