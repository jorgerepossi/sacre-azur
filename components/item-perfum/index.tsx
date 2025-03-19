import React from 'react';
import {Perfume} from "@/types/perfume.type";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";


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
                <div className="relative h-48 bg-muted">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill
                           className="object-cover"/>
                </div>
                <div className="p-4">
                    <div className="h-8 mb-2">
                        <Image
                            src={item.logo || "/placeholder.svg"}
                            alt={`${item.brand} logo`}
                            width={100}
                            height={30}
                            className="object-contain h-full"
                        />
                    </div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Link href={`/perfume/${createSlug(item.name)}_${item.id}`} className="w-full">
                    <Button className="w-full" variant="outline">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};

export default ItemPerfume;