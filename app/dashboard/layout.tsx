"use client"
import React, { useState } from "react";
import AsideDashboard from "@/features/dashboard/aside";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Section from "@/components/section";
import Box from "@/components/box";

interface LayoutDashboardProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutDashboardProps) => {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <Section className={"flex h-full"}>
                <AsideDashboard />
                <Box className={"py-[2rem] px-[2rem] w-full overflow-y-scroll flex-1 h-full"}>{children}</Box>
            </Section>
        </QueryClientProvider>
    );
};

export default Layout;
