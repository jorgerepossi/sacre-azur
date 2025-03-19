import React from 'react'
import {Geist} from "next/font/google";

import {ThemeProvider} from "next-themes";

import "./globals.css";

import {BrandFilterProvider} from "@/features/aside-content";

// @Components
import Header from "@/components/header";
import Footer from "@/components/footer";


const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata = {
    metadataBase: new URL(defaultUrl),
    title: "Perfume Store",
    description: "Find your signature scent",
};

const geistSans = Geist({
    display: "swap",
    subsets: ["latin"],
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={geistSans.className} suppressHydrationWarning>
        <body className="bg-background text-foreground h-full">
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
           <div className="grid h-full ">
                <div className="grid grid-rows-[auto_1fr_auto] h-full">
                   <Header />
                    <main className="flex flex-col gap-20  h-full overflow-auto bg-background ">
                        <BrandFilterProvider>
                            {children}
                        </BrandFilterProvider>
                    </main>
                    <Footer />
                </div>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}
