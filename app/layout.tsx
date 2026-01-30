import { Nunito_Sans as NunitoSansFont } from "next/font/google";

import "./globals.css";
import { Providers } from "./providers";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunitoSans.className} suppressHydrationWarning>
      <body className="h-full bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
