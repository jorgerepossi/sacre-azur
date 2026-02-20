import { useState } from "react";

import { SIZE_FACTORS } from "@/lib/pricing-constants";

export const usePerfume = (pricePer100ml: number, profit: number, decantSettings?: { minSize: number, has12ml: boolean }) => {
  const sizes = [];

  if (decantSettings) {
    if (decantSettings.has12ml) {
      sizes.push({ label: "1.2 ml", value: 1.2 });
    }
    sizes.push({ label: `${decantSettings.minSize} ml`, value: decantSettings.minSize });
    sizes.push({ label: "5 ml", value: 5 });
    sizes.push({ label: "10 ml", value: 10 });
  } else {
    // Default fallback
    sizes.push({ label: "2.5 ml", value: 2.5 });
    sizes.push({ label: "5 ml", value: 5 });
    sizes.push({ label: "10 ml", value: 10 });
  }

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [profitMargin, setProfitMargin] = useState(profit);

  const calculatePrice = (sizeInMl: number) => {
    const priceWithProfit = pricePer100ml * (1 + profitMargin / 100);

    const pricePerMl = priceWithProfit / 100;

    const sizeFactor =
      SIZE_FACTORS[sizeInMl as keyof typeof SIZE_FACTORS] || 1.0;

    return Math.round(pricePerMl * sizeInMl * sizeFactor);
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
    calculatePrice
  };
};
