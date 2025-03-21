import React from 'react';
import {ThemeToggle} from "@/components/theme-toggle";

const Footer = () => {
    return (
        <footer className="border-t py-6 bg-background">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">&copy; 2025 {process.env.NEXT_PUBLIC_SITE_NAME}. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <ThemeToggle/>
                    <button className="text-sm text-muted-foreground hover:text-foreground">Terms</button>
                    <button className="text-sm text-muted-foreground hover:text-foreground">Privacy</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;