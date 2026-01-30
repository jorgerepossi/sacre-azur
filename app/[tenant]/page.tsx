"use client";

import AsideContent from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";
import { BrandFilterProvider } from "@/providers/BrandFilterProvider";
import { NoteFilterProvider } from "@/providers/NoteFilterProvider";

import AsideWrapper from "@/components/aside";
import Box from "@/components/box";
import FilterDrawer from "@/components/filter-drawer";
import Flex from "@/components/flex";

export default function Home() {
  return (
    <BrandFilterProvider>
      <NoteFilterProvider>
        <Box className="container flex h-screen flex-col gap-6 overflow-hidden p-5">
          <Box>
            <Flex className={"flex-col"}>
              <p className={"m-0 text-title-large"}>
                Encuentra tu siguiente fragancia
              </p>
              <p
                className={
                  "font-xs text-headline-subtitle text-muted-foreground"
                }
              >
                Explorá los mejores decants del mundo. De los clásicos
                imbatibles a las joyas ocultas de la perfumería de autor.
              </p>
            </Flex>
          </Box>

          <Flex className="w-full flex-1 gap-6 overflow-hidden lg:flex-row">
            <Flex className={"hidden flex-col lg:flex"}>
              <AsideWrapper>
                <AsideContent />
              </AsideWrapper>
            </Flex>

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
