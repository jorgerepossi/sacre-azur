"use client";

import AsideWrapper from "@/components/aside";
import AsideContent, { BrandFilterProvider } from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";

export default function Home() {
    return (
        <BrandFilterProvider>
            <main className="flex-1 flex flex-col gap-6 p-5">
                <div className={'flex flex-col md:flex-row gap-6'}>
                    <AsideWrapper>
                        <AsideContent/>
                    </AsideWrapper>
                    <div className="flex-1">
                        <PerfumeGridClient />
                    </div>
                </div>
            </main>
        </BrandFilterProvider>
    );
}
