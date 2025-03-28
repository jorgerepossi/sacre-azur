"use client";

import { ThemeProvider } from "next-themes";

import { BrandFilterProvider } from "@/providers/BrandFilterProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

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
