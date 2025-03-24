import React from 'react';

import Link from 'next/link'
import {Power} from 'lucide-react'

// @Constants
import MENU_ASIDE_DASHBOARD from "@/constants/menu-aside.constant";

// @Components
import Box from "@/components/box";
import Flex from "@/components/flex";
import {Button} from "@/components/ui/button";

const AsideDashboard = () => {
    return (
        <aside className={'flex flex-col justify-between w-[200px]  h-full py-4 bg-background_white border-r '}>
            <Flex className={'flex flex-col '}>
                {MENU_ASIDE_DASHBOARD.map((item) => (
                    <Box key={item.id} className={' hover:cursor-pointer border-b hover:bg-accent transition-colors '}>
                        <Button variant={'ghost'}  className={'! justify-start'} asChild >

                        <Link href={item.link} className={'w-full text-left  '}  >
                            <Box className="flex gap-[.5rem] items-center text-[14px]   hover:underline-offset-0 " >
                                <span className={'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm hover:underline-o  '}>  {item.icon} </span>
                                <p className={
                                    'text-primary_text_dark text-body-medium'
                                }>{item.label}</p>
                            </Box>
                        </Link>
                        </Button>
                    </Box>
                ))}
            </Flex>
            <Flex className="justify-center items-center py-4 min-w-[10rem]"><Power/></Flex>
        </aside>
    );
};

export default AsideDashboard;