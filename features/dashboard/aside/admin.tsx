import React from "react";
import Link from "next/link";
import { Power } from "lucide-react";
import Box from "@/components/box";
import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import MENU_ASIDE_ADMIN from "@/constants/menu-aside-admin.constant";

const AsideAdmin = () => {
  return (
    <aside className="flex h-full w-[200px] flex-col justify-between border-r bg-background_white py-4">
      <Flex className="flex flex-col">
        {MENU_ASIDE_ADMIN.map((item) => (
          <Box
            key={item.id}
            className="border-b transition-colors hover:cursor-pointer hover:bg-accent"
          >
            <Button variant="ghost" className="!justify-start" asChild>
              <Link href={item.link} className="w-full text-left">
                <Box className="flex items-center gap-[.5rem] text-[14px]">
                  <span>{item.icon}</span>
                  <p className="text-body-medium text-primary_text_dark">
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

export default AsideAdmin;