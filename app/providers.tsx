"use client";
import { ThemeProvider } from "next-themes";
import { BrandFilterProvider } from "@/providers/BrandFilterProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { NoteFilterProvider } from "@/providers/NoteFilterProvider";

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
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster position="bottom-center" />
        <BrandFilterProvider>
          <NoteFilterProvider>
            {children}
          </NoteFilterProvider>
        </BrandFilterProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
