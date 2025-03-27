"use client";

import React, { createContext, useState } from "react";

interface AsideProps {
  children: React.ReactNode;
}

const AsideWrapper = ({ children }: AsideProps) => {
  return (
    <aside
      className={"w-full shrink-0 rounded-lg border bg-card p-4 md:w-[320px]"}
    >
      {children}
    </aside>
  );
};

export default AsideWrapper;
