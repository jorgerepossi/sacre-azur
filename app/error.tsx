"use client";

import { useEffect } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
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
        <h1 className="mb-4 text-2xl font-bold">Algo salió mal</h1>
        <p className="mb-6 text-muted-foreground">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al
          inicio.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={reset} variant="outline">
            Reintentar
          </Button>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
