import { useState } from "react";

import { SIZE_FACTORS } from "@/lib/pricing-constants";

const sizes = [
  { label: "2.5 ml", value: 2.5 },
  { label: "5 ml", value: 5 },
  { label: "10 ml", value: 10 },
];

export const usePerfume = (pricePer100ml: number, profit: number) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [profitMargin, setProfitMargin] = useState(profit);

  // Calcular precio con profit margin y size factor
  const calculatePrice = (sizeInMl: number) => {
    // 1. Aplicar profit margin al precio base
    const priceWithProfit = pricePer100ml * (1 + profitMargin / 100);

    // 2. Calcular precio por ml
    const pricePerMl = priceWithProfit / 100;

    // 3. Obtener factor de tamaño
    const sizeFactor =
      SIZE_FACTORS[sizeInMl as keyof typeof SIZE_FACTORS] || 1.0;

    // 4. Calcular precio final
    return pricePerMl * sizeInMl * sizeFactor;
  };

  const rawUnitPrice = calculatePrice(selectedSize.value);
  const rawTotalPrice = rawUnitPrice * quantity;

  const totalPrice = new Intl.NumberFormat("es-AR").format(
    Math.floor(rawTotalPrice),
  );

  return {
    sizes,
    quantity,
    totalPrice,
    rawUnitPrice,
    profitMargin,
    selectedSize,
    setQuantity,
    setSelectedSize,
    setProfitMargin,
  };
};
