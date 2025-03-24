import { Nunito_Sans as NunitoSansFont } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

// @Components
import Header from "@/components/header";
import Footer from "@/components/footer";

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
        <body className="bg-background text-foreground h-full">
        <Providers>
            <div className="grid h-full">
                <div className="grid grid-rows-[auto_1fr_auto] h-full">
                    <Header />
                    <main className="flex flex-col gap-20 h-full overflow-auto bg-background">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </Providers>
        </body>
        </html>
    );
}
