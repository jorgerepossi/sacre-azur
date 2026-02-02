"use client";

import AsideContent from "@/features/aside-content";
import PerfumeGridClient from "@/features/perfum-grid-client";
import { BrandFilterProvider } from "@/providers/BrandFilterProvider";
import { NoteFilterProvider } from "@/providers/NoteFilterProvider";
import FilterDrawer from "@/components/filter-drawer";
import Flex from "@/components/flex";

export default function Home() {
  return (
    <BrandFilterProvider>
      <NoteFilterProvider>
        <div className="container mx-auto px-5 py-6">

          <div className="mb-6">
            <Flex className={"flex-col"}>
              <p className={"m-0 text-title-large"}>
                Encuentra tu siguiente fragancia
              </p>
              <p className={"font-xs text-headline-subtitle text-muted-foreground"}>
                Explorá los mejores decants del mundo. De los clásicos
                imbatibles a las joyas ocultas de la perfumería de autor.
              </p>
            </Flex>
          </div>


          <div className="flex gap-6 items-start">

            <aside className="hidden lg:block sticky top-[80px] w-[320px] shrink-0 self-start rounded-lg border bg-card p-4">
              <AsideContent />
            </aside>


            <div className="flex-1 min-w-0">
              <PerfumeGridClient />
            </div>
          </div>

          {/* Botón filtros mobile */}
          <FilterDrawer />
        </div>
      </NoteFilterProvider>
    </BrandFilterProvider>
  );
}