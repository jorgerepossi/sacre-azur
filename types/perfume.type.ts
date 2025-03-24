export interface Brand {
    id: string;
    name: string;
    active: boolean;
    image?: string;
}
export  interface Perfume {
    id: number
    name: string
    brand: Brand
    image: string
    logo: string
    price: number
    description: string
    external_link?: string
    brand_id?: string;
    in_stock: boolean;
    profit_margin: number;
}

