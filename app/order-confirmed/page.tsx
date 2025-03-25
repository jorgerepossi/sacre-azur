import OrderConfirmedPage from "@/features/confirmed-page";
import { Suspense } from "react";


export default function OrderConfirmedWrapper() {
    return (
        <Suspense fallback={<p className="p-6">Loading...</p>}>
            <OrderConfirmedPage />
        </Suspense>
    );
}
