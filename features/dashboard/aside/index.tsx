import React from 'react';

import Link from 'next/link'
import {Power} from 'lucide-react'

// @Constants
import MENU_ASIDE_DASHBOARD from "@/constants/menu-aside.constant";

// @Components
import Box from "@/components/box";
import Flex from "@/components/flex";

const AsideDashboard = () => {
    return (
        <aside className={'flex flex-col justify-between h-full py-4 background_white border-r '}>
            <Box className={'flex flex-col '}>
                {MENU_ASIDE_DASHBOARD.map((item) => (
                    <Box key={item.id} className={' hover:cursor-pointer border-b hover:bg-accent transition-colors '}>
                        <Link href={item.link} >
                            <Box className="flex gap-[.5rem] items-center text-[14px] px-[1rem] py-[1rem]">
                                <span className={'text-muted-foreground shrink-0 '}>  {item.icon} </span>
                                {item.label}
                            </Box>
                        </Link>
                    </Box>
                ))}
            </Box>
            <Flex className="justify-center items-center py-4 min-w-[10rem]"><Power/></Flex>
        </aside>
    );
};

export default AsideDashboard;