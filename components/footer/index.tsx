import React from "react";

import { format } from "date-fns";

import { ThemeToggle } from "@/components/theme-toggle";

const Footer = () => {
  const currentYear = format(new Date(), "yyyy");

  return (
    <footer className="border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          &copy; 2025–{currentYear} {process.env.NEXT_PUBLIC_SITE_NAME}. All
          rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Terms
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Privacy
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
