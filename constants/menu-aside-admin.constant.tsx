import { Building } from "lucide-react";

import { MenuAside } from "@/types/menu-aside.type";

const MENU_ASIDE_ADMIN: MenuAside[] = [
  {
    id: "tenants",
    link: "/admin/dashboard/tenants",
    label: "Tiendas",
    icon: <Building color={"var(--secondary-text-dark)"} />,
  },
  {
    id: "dashboard",
    link: "/decants/dashboard/",
    label: "Dashboard",
    icon: <Building color={"var(--secondary-text-dark)"} />,
  },
];

export default MENU_ASIDE_ADMIN;
