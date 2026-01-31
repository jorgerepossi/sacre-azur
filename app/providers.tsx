"use client";

import { ThemeProvider } from "next-themes";

import { BrandFilterProvider } from "@/providers/BrandFilterProvider";
import { NoteFilterProvider } from "@/providers/NoteFilterProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { DataProvider } from "@/providers/DataContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: true,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DataProvider>

      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster position="bottom-center" />
        <BrandFilterProvider>
          <NoteFilterProvider>{children}</NoteFilterProvider>
        </BrandFilterProvider>
      </ThemeProvider>
      </DataProvider>
    </QueryClientProvider>
  );
}
