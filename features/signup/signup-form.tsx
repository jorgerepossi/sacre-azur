"use client";
import { useState } from "react";
import Link from "next/link";
import { signUpAction } from "@/app/actions";
import Flex from "@/components/flex";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupForm({ searchParams }: { searchParams: Message }) {
    const [isView, setIsView] = useState(false);

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md p-8">
                <form className="mx-auto flex flex-col">
                    <h1 className="text-2xl font-medium">Registrarse</h1>
                    <div className="mt-8 flex flex-col gap-2 [&>input]:mb-3">
                        {/* ... todos los campos igual ... */}

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
                                <Link className="font-medium text-primary underline" href="/sign-in">
                                    Sign in
                                </Link>
                            </p>
                        </Flex>
                        <FormMessage message={searchParams} />
                    </div>
                </form>
            </Card>
        </div>
    );
}