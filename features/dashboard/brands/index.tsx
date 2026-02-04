"use client";

import React, { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import CreateBrandForm from "@/features/dashboard/create/create-brand-form";
import { useTenant } from "@/providers/TenantProvider";
import { Edit2 } from "lucide-react";

import Box from "@/components/box";
import ContentBlock from "@/components/content-block";
import Flex from "@/components/flex";
import SmallLoader from "@/components/loaders/small";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Brand } from "@/types/perfume.type";

import { useFetchBrands } from "@/hooks/useFetchBrands";
import { useToggleBrandStatus } from "@/hooks/useToggleBrandStatus";

const BrandPageContent = () => {
  const router = useRouter();
  const { tenant } = useTenant();
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const { data, isLoading } = useFetchBrands();
  const toggleStatus = useToggleBrandStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter((brand: Brand) =>
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data, searchQuery]);

  if (isLoading || !data) return <SmallLoader />;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Flex className={"w-full gap-[2rem]"}>
      <ContentBlock
        title={"Listado de marcas"}
        subtitle="Busca la marca que quieras activar/desactivar"
      >
        <Card className={"flex w-full flex-col gap-4"}>
          <Flex className="p-4">
            <Input
              type="text"
              placeholder="Buscar marca..."
              className="w-full rounded-md border p-2"
              value={inputValue}
              onChange={handleSearchChange}
            />
          </Flex>
          <Box className="max-h-[520px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className={"w-[90px]"}>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-[80px]">Editar</TableHead>
                  <TableHead className="w-[80px] text-right">Activo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="max-h-[600px] !overflow-hidden">
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No se encontraron marcas.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item: Brand) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-md border object-cover"
                        />
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="w-[80px]">
                        <Button
                          type="button"
                          variant={"outline"}
                          onClick={() =>
                            router.push(
                              `/${tenant?.slug}/dashboard/brands/edit/${item.id}`,
                            )
                          }
                        >
                          {" "}
                          <Edit2 size={12} />
                        </Button>
                      </TableCell>
                      <TableCell className="w-[80px] text-right">
                        <Switch
                          checked={item.active}
                          onCheckedChange={(checked) =>
                            toggleStatus.mutate({
                              id: item.id,
                              active: checked,
                            })
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Box>
        </Card>
      </ContentBlock>
      <ContentBlock
        title={"Crear nueva marca"}
        className={"max-w-[500px]"}
        subtitle="Si no encuentras en el listado la marca puedes crearla o solicitar que sea creada"
      >
        <Card className={"w-full p-[2rem]"}>
          <CreateBrandForm />
        </Card>
      </ContentBlock>
    </Flex>
  );
};

export default BrandPageContent;
