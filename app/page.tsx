"use client";

import AsideContent  from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";

import AsideWrapper from "@/components/aside";
import Flex from "@/components/flex";
import {BrandFilterProvider} from "@/providers/BrandFilterProvider";

export default function Home() {
  return (
    <BrandFilterProvider>
      <main className="container flex min-h-screen flex-1 flex-col gap-6 p-5">
        <div className="container mx-auto">
          <Flex className={"flex-col"}>
            <p className={"text-title-large"}>Find Your Next Adventure</p>
            <p className={"text-headline-subtitle text-muted-foreground"}>
              Discover trips planned by fellow travelers...
            </p>
          </Flex>
        </div>
        <div className="flex w-full flex-col gap-6 md:flex-row">
          <div>
            <AsideWrapper>
              <AsideContent />
            </AsideWrapper>
          </div>
          <div className="mx-auto w-full flex-1">
            <PerfumeGridClient />
          </div>
        </div>
      </main>
    </BrandFilterProvider>
  );
}
