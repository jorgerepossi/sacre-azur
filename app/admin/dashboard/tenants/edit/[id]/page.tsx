import EditTenantContent from "@/features/dashboard/tenants/edit/[id]";

interface EditTenantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  const { id } = await params;
  return <EditTenantContent tenantId={id} />;
}