"use client";

import React from "react";

import { Search } from "lucide-react";

import BrandSelectOptions from "@/components/brand-select-options";
import Flex from "@/components/flex";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFetchBrands } from "@/hooks/useFetchBrands";

import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  brandFilter: string | null;
  setBrandFilter: (value: string | null) => void;
  onlyInStock: boolean;
  setOnlyInStock: (value: boolean) => void;
};

const PerfumeSearchList = ({
  nameFilter,
  setNameFilter,
  brandFilter,
  setBrandFilter,
  onlyInStock,
  setOnlyInStock,
}: Props) => {
  const { data: brands } = useFetchBrands();

  return (
    <Flex className="flex-wrap justify-between gap-[1rem]">
      <Flex className="relative w-full max-w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search..."
          value={nameFilter}
          className="pl-8"
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </Flex>

      <Flex className="w-full max-w-[500px] items-center gap-[2rem]">
        <p className="w-[100px]">Filter by:</p>

        <Flex className={"w-full gap-[1rem]"}>
          <Select
            onValueChange={(value) =>
              setBrandFilter(value === "" ? null : value)
            }
            value={brandFilter ?? ""}
          >
            <SelectTrigger>
              <SelectValue placeholder="Brands" />
            </SelectTrigger>
            <SelectContent>
              <BrandSelectOptions brands={brands || []} />
            </SelectContent>
          </Select>
          {brandFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBrandFilter(null)}
            >
              ✕
            </Button>
          )}
        </Flex>
        <Button
          variant={onlyInStock ? "default" : "outline"}
          onClick={() => setOnlyInStock(!onlyInStock)}
        >
          In Stock
        </Button>
      </Flex>
    </Flex>
  );
};

export default PerfumeSearchList;
