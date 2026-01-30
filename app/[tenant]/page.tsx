"use client";

import AsideContent from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";
import { BrandFilterProvider } from "@/providers/BrandFilterProvider";
import { NoteFilterProvider } from "@/providers/NoteFilterProvider";

import AsideWrapper from "@/components/aside";
import Box from "@/components/box";
import Flex from "@/components/flex";

export default function Home() {
  return (
    <BrandFilterProvider>
      <NoteFilterProvider>
        <Box className="container flex flex-col gap-6 p-5 h-screen overflow-hidden">

          <Box>
            <Flex className={"flex-col"}>
              <p className={"text-title-large m-0"}>Encuentra tu siguiente fragancia</p>
              <p className={"text-headline-subtitle text-muted-foreground"}>
                Discover trips planned by fellow travelers...
              </p>
            </Flex>
          </Box>


          <Flex className="w-full gap-6 lg:flex-row flex-1 overflow-hidden">

            <Flex className={"flex-col"}>
              <AsideWrapper>
                <AsideContent />
              </AsideWrapper>
            </Flex>


            <div className="w-full flex-1 overflow-y-auto p-4">
              <PerfumeGridClient />
            </div>
          </Flex>
        </Box>
      </NoteFilterProvider>
    </BrandFilterProvider>
  );
}