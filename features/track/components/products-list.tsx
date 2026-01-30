import { formatNumberWithDots } from "@/lib/formatNumberWithDots";

interface ProductsListProps {
  products: any[];
}

export default function ProductsList({ products }: ProductsListProps) {
  const total = products.reduce(
    (sum, item) => sum + Number(item?.price || 0) * Number(item?.quantity || 0),
    0,
  );

  return (
    <div className="rounded-lg border p-6">
      <h3 className="mb-4 font-semibold">Productos</h3>
      <div className="space-y-3">
        {products.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span>
              {item.name} ({item.size}ml) x{item.quantity}
            </span>
            <span className="font-semibold">
              $
              {formatNumberWithDots(
                Number(item.price || 0) * Number(item.quantity || 0),
              )}
            </span>
          </div>
        ))}
        <div className="flex justify-between border-t pt-3 font-bold">
          <span>Total:</span>
          <span>${formatNumberWithDots(total)}</span>
        </div>
      </div>
    </div>
  );
}
