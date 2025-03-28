import React from "react";
import Link from "next/link";
import { Power } from "lucide-react";

// @Components
import Box from "@/components/box";
import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";

// @Constants
import MENU_ASIDE_DASHBOARD from "@/constants/menu-aside.constant";

const AsideDashboard = () => {
  return (
    <aside
      className={
        "flex h-full w-[200px] flex-col justify-between border-r bg-background_white py-4"
      }
    >
      <Flex className={"flex flex-col"}>
        {MENU_ASIDE_DASHBOARD.map((item) => (
          <Box
            key={item.id}
            className={
              "border-b transition-colors hover:cursor-pointer hover:bg-accent"
            }
          >
            <Button variant={"ghost"} className={"! justify-start"} asChild>
              <Link href={item.link} className={"w-full text-left"}>
                <Box className="flex items-center gap-[.5rem] text-[14px] hover:underline-offset-0">
                  <span
                    className={
                      "peer/menu-button ring-sidebar-ring active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:underline-o flex h-8 w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0"
                    }
                  >
                    {" "}
                    {item.icon}{" "}
                  </span>
                  <p className={"text-body-medium text-primary_text_dark"}>
                    {item.label}
                  </p>
                </Box>
              </Link>
            </Button>
          </Box>
        ))}
      </Flex>
      <Flex className="min-w-[10rem] items-center justify-center py-4">
        <Power />
      </Flex>
    </aside>
  );
};

export default AsideDashboard;
