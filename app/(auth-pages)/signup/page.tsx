import Link from "next/link";

import { signUpAction } from "@/app/actions";

import Flex from "@/components/flex";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center gap-2 p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <form className="mx-auto flex flex-col">
          <h1 className="text-2xl font-medium">Registrarse</h1>

          <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
            <Label htmlFor="tenantName">Nombre de tu tienda (opcional)</Label>
            <Input name="tenantName" placeholder="Mi Perfumería" />

            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="******"
              minLength={6}
              required
            />
            <SubmitButton formAction={signUpAction} pendingText="Signing up...">
              Ingresar
            </SubmitButton>
            <Flex className="flex-col">
              <p className="text text-sm text-foreground">
                Tenes una cuenta?
                <Link
                  className="font-medium text-primary underline"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </Flex>
            <FormMessage message={searchParams} />
          </div>
        </form>
        <SmtpMessage />
      </Card>
    </div>
  );
}
