import React from "react";

import Grid from "@/components/grid";
import SkeletonPerfumeListItem from "@/components/skeletons/skeleton-perfume-list-item";

const SkeletonPerfumeList = () => {
  return (
    <Grid className="grid w-full grid-cols-1 gap-8 md:grid-cols-4">
      {Array(9)
        .fill(null)
        .map((_, index) => (
          <SkeletonPerfumeListItem key={`skeleton-${index}`} />
        ))}
    </Grid>
  );
};

export default SkeletonPerfumeList;
