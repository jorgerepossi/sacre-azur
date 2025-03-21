import React from "react";
import { Nunito_Sans as NunitoSansFont } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import "./globals.css";
import { BrandFilterProvider } from "@/features/aside-content";

// @Components
import Header from "@/components/header";
import Footer from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: process.env.NEXT_PUBLIC_SITE_NAME,
    description: "Find your signature scent",
};

const nunitoSans = NunitoSansFont({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={nunitoSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground h-full">
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster position="bottom-center" />
            <div className="grid h-full">
                <div className="grid grid-rows-[auto_1fr_auto] h-full">
                    <Header />
                    <main className="flex flex-col gap-20 h-full overflow-auto bg-background">
                        <BrandFilterProvider>{children}</BrandFilterProvider>
                    </main>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
