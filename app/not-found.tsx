// app/not-found.tsx
"use client";

import { useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

// app/not-found.tsx

// app/not-found.tsx

// app/not-found.tsx

// app/not-found.tsx

// app/not-found.tsx

// app/not-found.tsx

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/"); // Prefetch para mejor performance
  }, [router]);

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-10 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-6 text-2xl font-semibold">Perfume Not Found</h2>
      <p className="mb-8 max-w-md text-muted-foreground">
        The perfume you're looking for doesn't exist or the URL might be
        incorrect.
      </p>
      <Link href="/" legacyBehavior passHref>
        <Button size="lg" asChild>
          <a>Return to Home</a>
        </Button>
      </Link>
    </div>
  );
}
