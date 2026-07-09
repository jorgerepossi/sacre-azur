"use client";

import { useEffect } from "react";

import { Link } from "@/components/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PerfumeDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">No pudimos cargar este perfume</h1>
        <p className="mb-6 text-muted-foreground">
          Hubo un problema al traer los datos de este producto. Podés
          intentar de nuevo o volver al catálogo.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="outline">
            Reintentar
          </Button>
          <Button asChild>
            <Link href="/">Volver al catálogo</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
