import { TenantProvider } from "@/providers/TenantProvider";

import Footer from "@/components/footer";
import Header from "@/components/header";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: {
    tenant: string;
  };
}

export default function TenantLayout({ children, params }: TenantLayoutProps) {
  return (
    <TenantProvider tenantSlug={params.tenant}>
      <div className="grid h-full">
        <div className="grid h-full grid-rows-[auto_1fr_auto]">
          <Header />
          <main className="flex h-full flex-col gap-20 overflow-auto bg-background">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </TenantProvider>
  );
}
