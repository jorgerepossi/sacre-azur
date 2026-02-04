import EditTenantContent from "@/features/dashboard/tenants/edit/[id]";

interface EditTenantPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTenantPage({ params }: EditTenantPageProps) {
  return <EditTenantContent params={params} />;
}
