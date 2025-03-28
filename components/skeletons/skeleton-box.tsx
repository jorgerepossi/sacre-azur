import React from "react";

import { Skeleton } from "@/components/ui/skeleton";

const SkeletonBox = ({ className }: { className: string }) => {
  return <Skeleton className={`${className} rounded-[16px]`} />;
};

export default SkeletonBox;
