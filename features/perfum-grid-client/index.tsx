"use client";

import Flex from "@/components/flex";
import { PerfumeGrid } from "@/components/perfum-grid";

interface PerfumeGridClientProps {
  isHome?: boolean;
}

export default function PerfumeGridClient({ isHome = false }: PerfumeGridClientProps) {
  return (
    <Flex className={"relative w-full"}>
      <PerfumeGrid isHome={isHome} />
    </Flex>
  );
}
