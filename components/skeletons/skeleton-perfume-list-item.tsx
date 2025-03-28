import React from "react";

import { SkeletonBox } from "@/components/skeletons/index";

import Flex from "../flex";

const SkeletonPerfumeListItem = () => {
  return (
    <Flex className="!hover:shadow-md w-full overflow-hidden rounded-lg border bg-background_white !shadow-sm transition-all duration-300 hover:-translate-y-1">
      <Flex className="w-full p-0">
        <Flex className="w-full flex-col p-[1rem]">
          <Flex className="h-[200px] w-full flex-1 items-center justify-center py-4 md:py-2">
            <SkeletonBox className={"h-[200px] w-full"} />
          </Flex>
          <Flex className="flex-col justify-between pb-[1rem] pt-[2rem] md:flex-row">
            <Flex className="flex flex-1 flex-col gap-[.25rem]">
              <SkeletonBox className={"h-[10px] w-[200px]"} />
              <SkeletonBox className={"h-[10px] w-[150px]"} />
            </Flex>
          </Flex>
          <Flex className="justify-between gap-[1rem] border-t-2 border-muted pt-[16px]">
            <SkeletonBox className={"h-[40px] w-[120px]"} />
            <SkeletonBox className={"h-[40px] w-[120px]"} />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default SkeletonPerfumeListItem;
