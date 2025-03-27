import React from 'react';
import {Perfume} from "@/types/perfume.type";
import Image from "next/image";
import Link from "next/link";

import {Card, CardContent, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

import Flex from '@/components/flex';


interface ItemPerfumeProps {
    item: Perfume
}

const createSlug = (name: string) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
}

const ItemPerfume = ({item}: ItemPerfumeProps) => {
    return (
        <Flex className="overflow-hidden w-full border bg-background_white !shadow-sm
          transition-all duration-300
          !hover:shadow-md
          hover:-translate-y-1 rounded-lg">

            <Flex className="p-0 w-full">
                <Flex className={'flex-row md:flex-col p-[1rem] w-full'}>
                    <Flex className={' flex-1  justify-center items-center py-4 md:py-2   '}>
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} width={200} height={100}
                               className="object-cover"/>
                    </Flex>
                    <Flex className={'justify-between pt-[2rem] pb-[1rem] flex-col md:flex-row'}>
                        <Flex className={'flex-1 gap-[.25rem] flex-col'}>
                            <p className="font-bold m-0">{item.name}</p>
                            <p className="text-body-medium text-muted-foreground m-0">by {item.brand.name}</p>
                        </Flex>

                    </Flex>
                    <Flex className={'  pt-[16px] gap-[1rem] border-t-2 border-muted justify-between '}>
                        <Button className={'w-[120px]'} variant={'ghost'}> Add wishlist </Button>

                        <Link href={`/perfume/${createSlug(item.name)}_${item.id}`} className="w-[120px]">
                            <Button className={'w-full  !bg-button-black'} color={'bg-button-black'}> View Detail </Button>
                        </Link>
                    </Flex>
                </Flex>


            </Flex>

        </Flex>
    );
};

export default ItemPerfume;