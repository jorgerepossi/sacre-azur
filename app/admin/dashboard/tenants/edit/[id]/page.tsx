import EditTenantContent from "@/features/dashboard/tenants/edit/[id]";

interface EditTenantPageProps {
  params: {
    id: string;
  };
}

export default function EditTenantPage({ params }: EditTenantPageProps) {
  return <EditTenantContent tenantId={params.id} />;
}