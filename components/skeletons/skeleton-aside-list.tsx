"use client";
import React from "react";
import Flex from "@/components/flex";
import Box from "@/components/box";
import { SkeletonBox } from "@/components/skeletons/index";


const SkeletonAsideList = () => {
  const MENU_LOADER = [
    {
      id: 1, with: 80
    },{
      id: 2, with: 200
    },{
      id: 3, with: 130
    },{
      id: 4, with: 180
    },{
      id: 5, with: 250
    },{
      id: 6, with: 180
    },{
      id: 7, with: 90
    },
  ];

  return (
    <Flex className="flex-col gap-[2rem]">
      <SkeletonBox className="w-[100px] h-[1rem]" />
      <Flex className="flex-col space-y-6">
        {MENU_LOADER.map((menu) => (
          <Flex key={`skeleton-${menu.id}`} className="gap-2 items-center">
            <Box>
            <SkeletonBox className="w-[20px] h-[20px]" />
            </Box>
            <SkeletonBox
              style={{ width: `${menu.with}px` }}
              className="h-[10px] transition-all duration-300"
            />
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};

export default SkeletonAsideList;