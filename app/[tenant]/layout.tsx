import type { Metadata } from "next";

import { TenantProvider } from "@/providers/TenantProvider";

import Footer from "@/components/footer";
import Header from "@/components/header";

interface TenantLayoutProps {
  children: React.ReactNode;
  params: Promise<{ tenant: string }>;
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Sacre Azur - Decants de Perfumes",
    template: "%s | Sacre Azur",
  },
  description: "Plataforma de venta de decants de perfumes de alta gama",
  keywords: ["perfumes", "decants", "fragancias", "nicho", "alta gama"],
  authors: [{ name: "Sacre Azur" }],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Sacre Azur",
    title: "Sacre Azur - Decants de Perfumes",
    description: "Plataforma de venta de decants de perfumes de alta gama",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sacre Azur",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sacre Azur - Decants de Perfumes",
    description: "Plataforma de venta de decants de perfumes de alta gama",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params;
  console.log("TENANT LAYOUT - slug:", tenant);
  return (
    <TenantProvider tenantSlug={tenant}>
      <div className="grid h-full">
        <div className="grid h-full grid-rows-[auto_1fr_auto]">
          <Header />
          <main className="flex h-full flex-col gap-20 bg-background">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </TenantProvider>
  );
}
