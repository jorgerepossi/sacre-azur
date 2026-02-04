"use client";

import { use } from "react";

import { useRouter } from "next/navigation";

import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Brand } from "@/types/perfume.type";

import { useFetchBrands } from "@/hooks/useFetchBrands";

interface RouteParams {
  tenant: string;
  id: string;
}
export default function BrandEditPage({ params }: { params: Promise<RouteParams> }) {
 const { tenant, id } =use(params);
  const router = useRouter();
  const { data, isLoading } = useFetchBrands();

  const brand = data?.find((b: Brand) => b.id === id);

  if (isLoading)
    return <div className="p-10 text-center">Cargando marca...</div>;

  if (!brand)
    return <div className="p-10 text-center">Marca no encontrada</div>;

  const handleBack = () => {
    router.back();
  };

  return (
    <Flex className="flex-col gap-4">
      <Flex className="" onClick={handleBack}>
        Volver 
      </Flex>
      <Card className="p-6">
        <form className="space-y-4">
          <h1 className="text-xl font-bold">Editando Marca: {brand.name}</h1>
          <Flex className="">
            <Flex className="gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  placeholder="Nombre de la marca"
                  defaultValue={brand.name}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <Input placeholder="Slug" defaultValue={brand.slug} />
              </div>
            </Flex>
          </Flex>
          <Button> Editar Marca</Button>
          <Button variant={"outline"} type="button" onClick={handleBack}>
            Cancelar
          </Button>

          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-gray-500">
              Ver JSON completo
            </summary>
            <pre className="mt-2 rounded bg-slate-100 p-2 text-[10px]">
              {JSON.stringify(brand, null, 2)}
            </pre>
          </details>
        </form>
      </Card>
    </Flex>
  );
}
