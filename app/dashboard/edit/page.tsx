import React, { Suspense } from "react";

import EditPerfumeContent from "@/features/dashboard/edit";
import SmallLoader from "@/components/loaders/small";

const EditPerfumePage = () => {
  return (
    <Suspense fallback={<SmallLoader />}>
      <EditPerfumeContent />
    </Suspense>
  );
};

export default EditPerfumePage;
