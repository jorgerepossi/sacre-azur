"use client"
import Link from "next/link";

import { signUpAction } from "@/app/actions";

import Flex from "@/components/flex";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { SmtpMessage } from "../smtp-message";
import { useState, use } from "react";

export default function Signup(props: {
  searchParams: Promise<Message>;
}) {

  const [isView, setIsView] = useState(false)

  const searchParams = use(props.searchParams);
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

            <Label>¿Qué tipo de productos vendés?</Label>
            <div className="mb-3 flex flex-col gap-3 rounded-lg border bg-muted/50 p-4">
              <label className="flex cursor-pointer items-start gap-3 rounded-md border-2 border-transparent bg-background p-3 transition-all hover:border-primary/50">
                <input
                  type="radio"
                  name="productType"
                  value="decant"
                  defaultChecked
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">Decants</span>
                  <span className="text-sm text-muted-foreground">
                    Muestras de perfumes en 2.5ml, 5ml y 10ml con margen de ganancia
                  </span>
                </div>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border-2 border-transparent bg-background p-3 transition-all hover:border-primary/50">
                <input
                  type="radio"
                  name="productType"
                  value="perfume"
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <div className="flex flex-col">
                  <span className="font-semibold">Perfumes</span>
                  <span className="text-sm text-muted-foreground">
                    Botellas completas de 30ml, 50ml y 100ml a precio fijo
                  </span>
                </div>
              </label>
            </div>

            <Label htmlFor="whatsappNumber">WhatsApp (opcional)</Label>
            <Input
              name="whatsappNumber"
              placeholder="+54 9 11 1234-5678"
              type="tel"
            />

            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
            <Label htmlFor="password">Password</Label>
            <Input
              type={isView ? "text" : "password"}
              name="password"
              placeholder="******"
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setIsView(!isView)}
            >
              {isView ? "Hide" : "Show"}
            </button>
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
