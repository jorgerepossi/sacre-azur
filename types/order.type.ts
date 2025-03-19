export type OrderProduct = {
    product_id: string;
    quantity: number;
    price: number;
};

export type OrderType = {
    id: string;
    order_code: string;
    order_email: string;
    order_products: OrderProduct[];
    created_at: string;
};
