import { Suspense } from "react";

import SmallLoader from "@/components/loaders/small";
import OrderConfirmedPage from "@/features/confirmed-page";


export default function OrderConfirmedWrapper() {
    return (
        <Suspense fallback={<SmallLoader />}>
            <OrderConfirmedPage />
        </Suspense>
    );
}
