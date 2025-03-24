"use client";

import React from "react";
import { Card } from "../ui/card";
import Flex from "@/components/flex";
import {
    Select,
    SelectContent,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import BrandSelectOptions from "@/components/brand-select-options";
import { useFetchBrands } from "@/hooks/useFetchBrands";
import { Button } from "../ui/button";

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
        <Card className="p-[1rem]">
            <Flex className="justify-between gap-[1rem] flex-wrap">
                <Flex className="w-full max-w-[300px]">
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                    />
                </Flex>

                <Flex className="w-full max-w-[500px] items-center gap-[2rem]">
                    <p className="w-[100px]">Filter by:</p>

                    <Flex className={' w-full gap-[1rem]'}>
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
        </Card>
    );
};

export default PerfumeSearchList;
