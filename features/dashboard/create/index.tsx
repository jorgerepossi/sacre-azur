"use client";

import { useState } from "react";

import { BookOpen } from "lucide-react";

import CreateBrandForm from "@/features/dashboard/create/create-brand-form";
import CreateForm from "@/features/dashboard/create/create-form";
import CatalogSearchModal from "@/features/dashboard/create/catalog-search-modal";

import ContentBlock from "@/components/content-block";
import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const CreatePageContent = () => {
  const [catalogOpen, setCatalogOpen] = useState(false);

  return (
    <>
      <Flex className={"flex-col gap-[2rem] lg:flex-row"}>
        <ContentBlock title={"Crear nuevo perfume"} className={"flex-1"}>
          <Card className={"flex flex-col gap-[2rem] !p-[2rem]"}>
            {/* Acceso rápido al catálogo */}
            <div className="flex items-center justify-between rounded-lg border border-dashed p-3">
              <div>
                <p className="text-sm font-medium">¿El perfume ya está en nuestro catálogo?</p>
                <p className="text-xs text-muted-foreground">
                  Buscalo y agregalo a tu inventario en segundos.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCatalogOpen(true)}
                className="flex shrink-0 items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Cargar desde catálogo
              </Button>
            </div>

            <CreateForm />
          </Card>
        </ContentBlock>
        <ContentBlock
          title={"Crear nueva marca"}
          className={"max-w-[500px] flex-1"}
        >
          <Card
            className={
              "flex w-full flex-col items-center justify-center gap-[2rem] !p-[2rem]"
            }
          >
            <CreateBrandForm />
          </Card>
        </ContentBlock>
      </Flex>

      <CatalogSearchModal
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
      />
    </>
  );
};

export default CreatePageContent;
