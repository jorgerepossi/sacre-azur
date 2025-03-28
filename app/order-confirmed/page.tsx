import { Suspense } from "react";

import OrderConfirmedPage from "@/features/confirmed-page";
import SmallLoader from "@/components/loaders/small";

export default function OrderConfirmedWrapper() {
  return (
    <Suspense fallback={<SmallLoader />}>
      <OrderConfirmedPage />
    </Suspense>
  );
}
