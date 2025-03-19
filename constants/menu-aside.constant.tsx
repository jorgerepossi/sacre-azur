import {MenuAside} from "@/types/menu-aside.type";

import {ListOrdered, SquarePlus, LayoutDashboard} from 'lucide-react'

const MENU_ASIDE_DASHBOARD: MenuAside[] = [{
    id: 'dashboard',
     link: '/dashboard',
     label: 'Dashboard',
     icon: <LayoutDashboard />
 },
     {
         id: 'create',
         link: '/dashboard/create',
         label: 'Create',
         icon: <SquarePlus />
     },
     {
         id: 'orders',
         link: '/dashboard/orders',
         label: 'Orders',
         icon: <ListOrdered />
     }
     ]
 export default MENU_ASIDE_DASHBOARD