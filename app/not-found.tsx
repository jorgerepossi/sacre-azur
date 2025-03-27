import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-10 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Perfume Not Found</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        The perfume you're looking for doesn't exist or the URL might be
        incorrect.
      </p>
      <Link href="/">
        <Button size="lg">Return to Home</Button>
      </Link>
    </div>
  );
}
