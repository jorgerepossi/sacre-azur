import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="container flex flex-col items-center justify-center min-h-[70vh] py-10 text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Perfume Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
                The perfume you're looking for doesn't exist or the URL might be incorrect.
            </p>
            <Link href="/">
                <Button size="lg">Return to Home</Button>
            </Link>
        </div>
    )
}
