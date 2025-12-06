import { Nunito_Sans as NunitoSansFont } from "next/font/google";

import Footer from "@/components/footer";
// @Components
import Header from "@/components/header";

import "./globals.css";

import { Providers } from "./providers";
import { getTenantSlug } from "@/hooks/useTenantSlug";
import { TenantProvider } from "@/providers/TenantProvider";

const nunitoSans = NunitoSansFont({
  display: "swap",
  subsets: ["latin"],
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: process.env.NEXT_PUBLIC_SITE_NAME,
  description: "Find your signature scent",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tenantSlug = await getTenantSlug();

  return (
    <html lang="en" className={nunitoSans.className} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground">
        <TenantProvider tenantSlug={tenantSlug}>
          <Providers>
            <div className="grid h-full">
              <div className="grid h-full grid-rows-[auto_1fr_auto]">
                <Header />
                <main className="flex h-full flex-col gap-20 overflow-auto bg-background">
                  {children}
                </main>
                <Footer />
              </div>
            </div>
          </Providers>
        </TenantProvider>
      </body>
    </html>
  );
}

