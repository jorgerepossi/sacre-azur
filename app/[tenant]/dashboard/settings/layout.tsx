"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const params = useParams();
    const tenant = params?.tenant;

    const navItems = [
        {
            label: "General",
            href: `/${tenant}/dashboard/settings`,
            active: pathname === `/${tenant}/dashboard/settings`,
        },
        {
            label: "Envíos",
            href: `/${tenant}/dashboard/settings/shipping`,
            active: pathname === `/${tenant}/dashboard/settings/shipping`,
        },
    ];

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex space-x-2 border-b pb-4">
                {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant={item.active ? "default" : "ghost"}
                            size="sm"
                        >
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </div>
            <div>{children}</div>
        </div>
    );
}
