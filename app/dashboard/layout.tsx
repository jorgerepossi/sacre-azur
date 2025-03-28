"use client";

import React, { useState } from "react";

import AsideDashboard from "@/features/dashboard/aside";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Box from "@/components/box";
import Section from "@/components/section";

interface LayoutDashboardProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutDashboardProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Section className={"flex h-full"}>
        <AsideDashboard />
        <Box
          className={
            "h-full w-full flex-1 overflow-y-scroll px-[2rem] py-[2rem]"
          }
        >
          {children}
        </Box>
      </Section>
    </QueryClientProvider>
  );
};

export default Layout;
