"use client";

import AsideWrapper from "@/components/aside";
import Flex from "@/components/flex";
import AsideContent, { BrandFilterProvider } from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";

export default function Home() {
    return (
        <BrandFilterProvider>
            <main className="flex-1 flex flex-col gap-6 p-5 min-h-screen container">

                <div className="container mx-auto">
                    <Flex className={'flex-col'}>
                        <p className={'text-title-large'}>Find Your Next Adventure</p>
                        <p className={'text-muted-foreground text-headline-subtitle'}>
                            Discover trips planned by fellow travelers...
                        </p>
                    </Flex>
                </div>
                <div className="flex flex-col md:flex-row gap-6 w-full">
                    <div>

                    <AsideWrapper>
                        <AsideContent/>
                    </AsideWrapper>
                    </div>
                    <div className="flex-1 w-full  mx-auto">
                        <PerfumeGridClient />
                    </div>
                </div>
            </main>
        </BrandFilterProvider>
    );
}