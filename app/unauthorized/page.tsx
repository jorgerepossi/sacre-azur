import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">Acceso No Autorizado</h1>
        <p className="mb-6 text-muted-foreground">
          No tenés permiso para acceder a este dashboard.
        </p>
        <Button asChild>
          <Link href="/sign-in">Volver al login</Link>
        </Button>
      </Card>
    </div>
  );
}
