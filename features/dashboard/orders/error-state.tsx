import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ErrorState() {
    return (
        <Alert variant="destructive" className="my-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load orders. Please try again later.</AlertDescription>
        </Alert>
    )
}

