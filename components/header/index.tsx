import React from 'react';
import {ThemeToggle} from "@/components/theme-toggle";
import LoginButton from "@/components/login-button";

const Header = () => {
    return (
        <header className="sticky top-0 z-10 border-b background_white">
            <div className="container flex h-16 items-center justify-between py-4">
                <h1 className="text-2xl font-bold">Perfume Store</h1>
                <div className="flex items-center gap-4">
                    <ThemeToggle/>
                    <LoginButton/>
                </div>
            </div>
        </header>
    );
};

export default Header;