import { useState } from "react";
import { calculateDecantPriceWithMargin } from "@/utils/priceCalculator";

const sizes = [
    { label: "2.5 ml", value: 2.5 },
    { label: "5 ml", value: 5 },
    { label: "10 ml", value: 10 },
];

// Function to format numbers with thousand separators and remove decimals
const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-AR").format(Math.floor(price)); // Ensure no decimals
};

export const usePerfume = (pricePer100ml: number,  profit: number) => {
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [quantity, setQuantity] = useState(1);
    const [profitMargin, setProfitMargin] = useState(profit); // Default profit margin in %


    const marginMultiplier = 1 + profitMargin / 100;


    const rawTotalPrice = parseFloat(calculateDecantPriceWithMargin(pricePer100ml, selectedSize.value, quantity, marginMultiplier));
    const totalPrice = formatPrice(rawTotalPrice);

    return {
        sizes,
        quantity,
        totalPrice,
        profitMargin,
        selectedSize,
        setQuantity,
        setSelectedSize,
        setProfitMargin,
    };
};
