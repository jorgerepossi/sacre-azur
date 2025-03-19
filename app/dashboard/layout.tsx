'use client';

import React from 'react';
import AsideDashboard from "@/features/dashboard/aside";

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import Section from "@/components/section";
import Box from "@/components/box";

interface LayoutDashboardProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

const Layout = ({children}: LayoutDashboardProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Section className={'flex h-full'}>
                <AsideDashboard/>
                <Box className={'py-[2rem] px-[2rem] w-full overflow-y-scroll h-full'}> {children} </Box>
            </Section>
        </QueryClientProvider>
    );
};

export default Layout;
