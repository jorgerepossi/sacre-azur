"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/link";
import { useTenantLink } from "@/hooks/useTenantLink";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { getLink } = useTenantLink();

    const navItems = [
        {
            label: "General",
            href: "/dashboard/settings",
        },
        {
            label: "Envíos",
            href: "/dashboard/settings/shipping",
        },
    ];

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex space-x-2 border-b pb-4">
                {navItems.map((item) => {
                    const fullHref = getLink(item.href);
                    const isActive = pathname === fullHref || (pathname === item.href && !pathname.includes(`/${fullHref.split('/')[1]}/`));

                    return (
                        <Link key={item.href} href={fullHref}>
                            <Button
                                variant={isActive ? "default" : "ghost"}
                                size="sm"
                            >
                                {item.label}
                            </Button>
                        </Link>
                    );
                })}
            </div>
            <div>{children}</div>
        </div>
    );
}
