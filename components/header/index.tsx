"use client";

import React from "react";

import Link from "next/link";

import { useCartStore } from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";

//import LoginButton from "@/components/login-button";
import { ThemeToggle } from "@/components/theme-toggle";

const Header = () => {
  const items = useCartStore((state) => state.items);
  {/*
    <LoginButton />
  */}
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 py-4">
        <Link href="/">

        <h1 className="text-2xl font-bold">Perfume Store</h1>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            {items.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {items.length}
              </span>
            )}
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Header;
