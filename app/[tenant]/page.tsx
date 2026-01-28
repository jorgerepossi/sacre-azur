"use client";

import AsideContent from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";
import { BrandFilterProvider } from "@/providers/BrandFilterProvider";

import AsideWrapper from "@/components/aside";
import Box from "@/components/box";
import Flex from "@/components/flex";

export default function Home() {
  return (
    <BrandFilterProvider>
      <main className="container flex min-h-screen flex-1 flex-col gap-6 p-5">
        <Box className="  ">
          <Flex className={"flex-col"}>
            <p className={"text-title-large m-0"}>Encuentra tu siguiente fragancia</p>
            <p className={"text-headline-subtitle text-muted-foreground "}>
              Discover trips planned by fellow travelers...
            </p>
          </Flex>
        </Box>
        <Flex className="w-full flex-col gap-6 lg:flex-row">
          <Flex className={"flex-col"}>
            <AsideWrapper>
              <AsideContent />
            </AsideWrapper>
          </Flex>
          <Flex className="mx-auto w-full flex-1">
            <PerfumeGridClient />
          </Flex>
        </Flex>
      </main>
    </BrandFilterProvider>
  );
}
