"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { BrandFilterProvider } from "@/features/aside-content";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
            >
                <Toaster position="bottom-center" />
                <BrandFilterProvider>{children}</BrandFilterProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
