"use client"
import React from 'react';
import {ThemeToggle} from "@/components/theme-toggle";
import LoginButton from "@/components/login-button";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const Header = () => {
    const items = useCartStore((state) => state.items);
    return (
        <header className="sticky top-0 z-10 border-b bg-background_white">
            <div className="px-4 flex h-16 items-center justify-between py-4">
                <h1 className="text-2xl font-bold">Perfume Store</h1>
                <div className="flex items-center gap-4">
                    <ThemeToggle/>
                    <Link href="/cart" className="relative">
                        <ShoppingCart className="w-6 h-6" />
                        {items.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
                        )}
                    </Link>
                    <LoginButton/>
                </div>
            </div>
        </header>
    );
};

export default Header;