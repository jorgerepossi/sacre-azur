"use client";

import Image from "next/image";
import { useFetchPerfumes } from "@/hooks/useFetchPerfumes";
import SmallLoader from "@/components/loaders/small";
import ContentBlock from "@/components/content-block";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export default function PerfumeList() {
    const { data: perfumes, isLoading, error } = useFetchPerfumes();

    if (isLoading) return <SmallLoader />;
    if (error) return <p>❌ Error al cargar los perfumes</p>;

    return (
        <ContentBlock title={"Perfumes"}>
            <ul className={'overflow-y-scroll max-h-[890px]'}>
                {perfumes?.map((perfume) => (
                    <li key={perfume.id} className="border p-4 rounded-lg mb-4">
                        <h3 className="font-bold text-lg">{perfume.name}</h3>
                        <p className="text-gray-600">{perfume.description}</p>
                        <p className="text-blue-500 font-semibold"> Precio: ${perfume.price}</p>
                        <p className="text-blue-500 font-semibold"> {perfume.external_link}</p>


                        <Image
                            src={perfume.image}
                            alt={perfume.name}
                            width={100}
                            height={100}
                            className="rounded-md"
                        />


                        {perfume.brand && (
                            <div className="flex items-center mt-2">
                                {perfume.brand.image && (
                                    <Image
                                        src={perfume.brand.image}
                                        alt={perfume.brand.name}
                                        width={40}
                                        height={40}
                                        className="rounded-full mr-2"
                                    />
                                )}
                                <span className="text-gray-800 font-medium">{perfume.brand.name}</span>
                            </div>
                        )}
                        <Link href={`/dashboard/edit?id=${perfume.id}`}>
                            <Button variant="outline">Edit</Button>
                        </Link>
                    </li>
                ))}
            </ul>
        </ContentBlock>
    );
}
