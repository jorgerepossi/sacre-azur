import React from "react";

import Image from "next/image";
import Link from "next/link";

import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";


import { Perfume } from "@/types/perfume.type";

interface ItemPerfumeProps {
  item: Perfume;
}

const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const ItemPerfume = ({ item }: ItemPerfumeProps) => {
  return (
    <Flex className="!hover:shadow-md w-full overflow-hidden rounded-lg border bg-background_white !shadow-sm transition-all duration-300 hover:-translate-y-1">
      <Flex className="w-full p-0">
        <Flex className={"w-full  p-[1rem] flex-col"}>
          <Flex className={"flex-1 items-center justify-center py-4 md:py-2"}>
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.name}
              width={200}
              height={100}
              className="object-cover"
            />
          </Flex>
          <Flex
            className={
              "flex-col justify-between pb-[1rem] pt-[2rem] md:flex-row"
            }
          >
            <Flex className={"flex-1 flex-col gap-[.25rem]"}>
              <p className="m-0 font-bold">{item.name}</p>
              <p className="m-0 text-body-medium text-muted-foreground">
                by {item.brand.name}
              </p>
            </Flex>
          </Flex>
          <Flex
            className={
              "justify-between gap-[1rem] border-t-2 border-muted pt-[16px]"
            }
          >
            <Button className={"w-[120px]"} variant={"ghost"}>
              Add wishlist
            </Button>

            <Link
              href={`/perfume/${createSlug(item.name)}_${item.id}`}
              className="w-[120px]"
            >
              <Button
                className={"!bg-button-black w-full"}
                color={"bg-button-black"}
              >
                View Detail
              </Button>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ItemPerfume;
