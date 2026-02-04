import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  calculateOrderTotal,
  formatPrice,
  type Product,
} from "@/utils/order-utils";

interface ProductsTableProps {
  products: Product[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="rounded-md border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-bold">Producto</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.name}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.size} ml</TableCell>
              <TableCell className="text-right">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell className="text-right">{product.quantity}</TableCell>
              <TableCell className="text-right">
                {formatPrice(product.price * product.quantity)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4} className="text-right font-bold">
              Total:
            </TableCell>
            <TableCell className="text-right font-bold">
              {formatPrice(calculateOrderTotal(products))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
