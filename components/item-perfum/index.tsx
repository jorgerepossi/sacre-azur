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
        <Card className="overflow-hidden">

            <CardContent className="p-0">
                <Flex className={'flex-row md:flex-col p-[1rem]'}>

                    <Flex className={'justify-between pt-[2rem] pb-[1rem] flex-col md:flex-row'}>
                        <Flex className={'flex-1  flex-col'}>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-body-medium text-muted-foreground m-0">by {item.brand.name}</p>
                        </Flex>
                        <Flex className={'justify-center items-center'}>
                            <Image src={item.image || "/placeholder.svg"} alt={item.name} width={150} height={150}
                                   className="object-cover"/>
                        </Flex>
                    </Flex>
                    <Flex className={'px-[.5rem] py-[1rem] gap-[1rem] border-t-2 border-neutral-200 '}>
                        <Button className={'w-full'} variant={'ghost'}> uno </Button>
                        <Link href={`/perfume/${createSlug(item.name)}_${item.id}`} className="w-full">
                            <Button className={'w-full'}> View Detail </Button>
                        </Link>
                    </Flex>
                </Flex>


            </CardContent>

        </Card>
    );
};

export default ItemPerfume;