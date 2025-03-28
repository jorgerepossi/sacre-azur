"use client";

import React from "react";

import CreateBrandForm from "@/features/dashboard/create/create-brand-form";
import Box from "@/components/box";
import ContentBlock from "@/components/content-block";
import Flex from "@/components/flex";
import SmallLoader from "@/components/loaders/small";
import { Card } from "@/components/ui/card";
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
  const { data, isLoading } = useFetchBrands();
  const toggleStatus = useToggleBrandStatus();

  if (isLoading || !data) return <SmallLoader />;

  return (
    <Flex className={"w-full gap-[2rem]"}>
      <ContentBlock title={" List brands"}>
        <Card className={"flex w-full"}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={"w-[90px]"}>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: Brand) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={item.active}
                      onCheckedChange={(checked) =>
                        toggleStatus.mutate({ id: item.id, active: checked })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </ContentBlock>
      <ContentBlock title={"Create new brand"} className={"max-w-[500px]"}>
        <Card className={"w-full p-[2rem]"}>
          <CreateBrandForm />
        </Card>
      </ContentBlock>
    </Flex>
  );
};

export default BrandPageContent;
