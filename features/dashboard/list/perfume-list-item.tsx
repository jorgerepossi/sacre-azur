import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

import Flex from "@/components/flex";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { Perfume } from "@/types/perfume.type";
import { formatNumberWithDots } from "@/lib/formatNumberWithDots";

interface PerfumeListItemProps {
  item: Perfume;
}

const PerfumeListItem = ({ item }: PerfumeListItemProps) => {
  return (
    <TableRow>
      <TableCell key={item.id} className="font-medium">
        <Image
          src={item.image}
          alt={item.name}
          width={80}
          height={80}
          className="rounded-md"
        />
      </TableCell>
      <TableCell className={"text-center"}>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuItem className="!w-full">
              <Link href={`/dashboard/edit?id=${item.id}`} className="w-full">
                <Flex className="w-full gap-[1rem]">
                  <Pencil size={16} /> Edit
                </Flex>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="!w-full">
              <Link href={`/dashboard/edit?id=${item.id}`} className="w-full">
                <Flex className="w-full gap-[1rem]">
                  <Trash2 size={16} /> Delete
                </Flex>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <TableCell className="font-medium">
        <p className={"text-body-medium"}>{item.name}</p>
      </TableCell>
      <TableCell className="font-medium">
        <p className={"text-body-medium"}>{item.brand.name}</p>
      </TableCell>
      <TableCell className="font-medium">
        <p className={"text-body-medium"}>
          ${formatNumberWithDots(item.price)}
        </p>
      </TableCell>
      <TableCell className="font-medium">
        <p className={"text-body-medium text-muted-foreground"}>
          {item.profit_margin}%
        </p>
      </TableCell>
      <TableCell className="font-medium">
        <code>{item.external_link}</code>
      </TableCell>
      <TableCell className="text-right font-medium">
        <Flex
          className={
            "h-[24px] w-[24px] items-center justify-center overflow-hidden rounded-full border bg-neutral-50"
          }
        >
          {item.in_stock && (
            <span className={"h-[24px] w-[24px] bg-green-200"} />
          )}
        </Flex>
      </TableCell>
    </TableRow>
  );
};

export default PerfumeListItem;
