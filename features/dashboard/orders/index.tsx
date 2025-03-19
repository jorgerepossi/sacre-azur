"use client";
import React from "react";
import { useOrders } from "@/hooks/useOrders";
import { OrderType } from "@/types/order.type";

const OrdersContent = () => {
    const { data: orders, isLoading, error } = useOrders();

    if (isLoading) return <p>Cargando...</p>;
    if (error) return <p>Error al cargar las órdenes</p>;
    if (!orders || orders.length === 0) return <p>No se encontraron listas</p>;

    return (
        <ul>
            {orders.map((order: OrderType) => (
                <li key={order.id}>
                    <h3>Orden: {order.order_code}</h3>
                    <p>Email: {order.order_email}</p>
                    <p>Fecha: {new Date(order.created_at).toLocaleDateString()}</p>
                    <h4>Productos:</h4>
                    <ul>
                        {order.order_products.map((product, index) => (
                            <li key={index}>
                                ID: {product.product_id}, Cantidad: {product.quantity}, Precio: ${product.price}
                            </li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    );
};

export default OrdersContent;
