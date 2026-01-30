"use client";

import React from "react";

import Box from "@/components/box";
import Flex from "@/components/flex";
import { SkeletonBox } from "@/components/skeletons/index";

const SkeletonAsideList = () => {
  const MENU_LOADER = [
    {
      id: 1,
      with: 80,
    },
    {
      id: 2,
      with: 200,
    },
    {
      id: 3,
      with: 130,
    },
    {
      id: 4,
      with: 180,
    },
    {
      id: 5,
      with: 250,
    },
    {
      id: 6,
      with: 180,
    },
    {
      id: 7,
      with: 90,
    },
  ];

  return (
    <Flex className="flex-col gap-[2rem]">
      <SkeletonBox className="h-[1rem] w-[100px]" />
      <Flex className="flex-col space-y-6">
        {MENU_LOADER.map((menu) => (
          <Flex key={`skeleton-${menu.id}`} className="items-center gap-2">
            <Box>
              <SkeletonBox className="h-[20px] w-[20px]" />
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
