"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-background p-4 text-foreground">
        <div className="w-full max-w-md rounded-lg border p-8 text-center">
          <h1 className="mb-4 text-2xl font-bold">Algo salió mal</h1>
          <p className="mb-6 text-muted-foreground">
            La aplicación encontró un error crítico. Intentá recargar la
            página.
          </p>
          <button
            onClick={reset}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
