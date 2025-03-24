import {MenuAside} from "@/types/menu-aside.type";

import {ListOrdered, SquarePlus, LayoutDashboard} from 'lucide-react'

const MENU_ASIDE_DASHBOARD: MenuAside[] = [{
    id: 'dashboard',
    link: '/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard color={'var(--secondary-text-dark)'}/>
},
    {
        id: 'create',
        link: '/dashboard/create',
        label: 'Create',
        icon: <SquarePlus color={'var(--secondary-text-dark)'}/>
    },
    {
        id: 'brands',
        link: '/dashboard/brands',
        label: 'Brands',
        icon: <ListOrdered color={'var(--secondary-text-dark)'}/>
    },
    {
        id: 'orders',
        link: '/dashboard/orders',
        label: 'Orders',
        icon: <ListOrdered color={'var(--secondary-text-dark)'}/>
    }
]
export default MENU_ASIDE_DASHBOARD