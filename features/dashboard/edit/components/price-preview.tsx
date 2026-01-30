import { useWatch } from "react-hook-form";

import { Card } from "@/components/ui/card";

import { SIZE_FACTORS } from "@/lib/pricing-constants";

interface PricePreviewProps {
  control: any;
}

export default function PricePreview({ control }: PricePreviewProps) {
  const price = useWatch({ control, name: "price" });
  const profitMargin = useWatch({ control, name: "profit_margin" });

  const calculatePrice = (sizeInMl: number) => {
    if (!price || !profitMargin) return 0;

    const priceWithProfit = Number(price) * (1 + Number(profitMargin) / 100);
    const pricePerMl = priceWithProfit / 100;
    const sizeFactor =
      SIZE_FACTORS[sizeInMl as keyof typeof SIZE_FACTORS] || 1.0;

    return Math.floor(pricePerMl * sizeInMl * sizeFactor);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-AR").format(amount);
  };

  if (!price || !profitMargin) return null;

  return (
    <Card className="bg-muted/30 p-4">
      <p className="mb-2 text-sm font-semibold">Precios finales:</p>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">2.5ml:</span>
          <span className="font-mono font-semibold">
            ${formatPrice(calculatePrice(2.5))}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">5ml:</span>
          <span className="font-mono font-semibold">
            ${formatPrice(calculatePrice(5))}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">10ml:</span>
          <span className="font-mono font-semibold">
            ${formatPrice(calculatePrice(10))}
          </span>
        </div>
      </div>
    </Card>
  );
}
