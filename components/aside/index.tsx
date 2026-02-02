"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AsideProps {
  children: React.ReactNode;
  sticky?: boolean;
}

const AsideWrapper = ({ children, sticky = false }: AsideProps) => {
  return (
    <aside
      className={cn(
        "w-full shrink-0 rounded-lg border bg-card p-4 md:w-[320px]",
        sticky && "md:sticky md:top-6"
      )}
    >
      {children}
    </aside>
  );
};

export default AsideWrapper;