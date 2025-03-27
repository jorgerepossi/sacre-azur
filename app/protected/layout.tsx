import { redirect } from "next/navigation";

import { getSession } from "@/utils/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  console.log("session", session);

  return <>{children}</>;
}
