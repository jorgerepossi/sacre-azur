"use client"
import React from 'react';
import {useFetchBrands} from "@/hooks/useFetchBrands";
import {useToggleBrandStatus} from "@/hooks/useToggleBrandStatus";

import {Card} from "@/components/ui/card";
import SmallLoader from "@/components/loaders/small";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TableHeader,
    TableHead,
} from "@/components/ui/table";
import {Switch} from "@/components/ui/switch";
import CreateBrandForm from "@/features/dashboard/create/create-brand-form";
import Box from "@/components/box";
import Flex from '@/components/flex';


import ContentBlock from "@/components/content-block";

const BrandPageContent = () => {
    const {data, isLoading} = useFetchBrands();
    const toggleStatus = useToggleBrandStatus();

    if (isLoading || !data) return <SmallLoader/>;

    return (
        <Flex className={'w-full gap-[2rem]'}>
            <ContentBlock title={' List brands'}>
                <Card className={'flex  w-full '}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className={'w-[90px]'}>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Active</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell><img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-md"
                                /></TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-right">
                                    <Switch
                                        checked={item.active}
                                        onCheckedChange={(checked) =>
                                            toggleStatus.mutate({id: item.id, active: checked})
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            </ContentBlock>
            <ContentBlock title={'Create new brand'} className={'max-w-[500px]'}>
                <Card className={'p-[2rem] w-full  '}>
                    <CreateBrandForm/>
                </Card>
            </ContentBlock>
        </Flex>
    );
};

export default BrandPageContent;
