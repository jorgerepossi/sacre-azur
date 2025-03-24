import React from 'react';


import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"



import {Card} from "@/components/ui/card";

import {Perfume} from "@/types/perfume.type";
import PerfumeListItem from "@/features/dashboard/list/perfume-list-item";

interface PerfumeListProps {
    data: Perfume[];
}

const PerfumeListContent = ({data}: PerfumeListProps) => {
    console.log(data)
    return (
        <Card>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Image</TableHead>
                        <TableHead></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>External Link</TableHead>
                        <TableHead>In Stock</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item) => (
                        <PerfumeListItem item={item} key={item.id} />
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export default PerfumeListContent;