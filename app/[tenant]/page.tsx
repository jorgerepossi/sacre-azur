"use client";

import AsideContent from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";
import { BrandFilterProvider } from "@/providers/BrandFilterProvider";
import { NoteFilterProvider } from "@/providers/NoteFilterProvider";

import AsideWrapper from "@/components/aside";
import FilterDrawer from "@/components/filter-drawer";
import Box from "@/components/box";
import Flex from "@/components/flex";

export default function Home() {
  return (
    <BrandFilterProvider>
      <NoteFilterProvider>
        <Box className="container flex flex-col gap-6 p-5 h-screen overflow-hidden">
          {/* Header */}
          <Box>
            <Flex className={"flex-col"}>
              <p className={"text-title-large m-0"}>Encuentra tu siguiente fragancia</p>
              <p className={"text-headline-subtitle text-muted-foreground"}>
                Discover trips planned by fellow travelers...
              </p>
            </Flex>
          </Box>

          {/* Contenedor principal */}
          <Flex className="w-full gap-6 lg:flex-row flex-1 overflow-hidden">
            {/* Aside - Solo desktop */}
            <Flex className={"flex-col hidden lg:flex"}>
              <AsideWrapper>
                <AsideContent />
              </AsideWrapper>
            </Flex>

            {/* Grid de perfumes */}
            <div className="w-full flex-1 overflow-y-auto p-4">
              <PerfumeGridClient />
            </div>
          </Flex>

          {/* Botón filtros mobile */}
          <FilterDrawer />
        </Box>
      </NoteFilterProvider>
    </BrandFilterProvider>
  );
}