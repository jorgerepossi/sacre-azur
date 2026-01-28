"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchFormProps {
  onSearch: (code: string) => void;
  loading: boolean;
  initialCode?: string;
}

export default function SearchForm({ onSearch, loading, initialCode = "" }: SearchFormProps) {
  const [orderCode, setOrderCode] = useState(initialCode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(orderCode);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="space-y-4">
        <div>
          <Label htmlFor="orderCode">Código de pedido</Label>
          <Input
            id="orderCode"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            placeholder="Ingresá tu código de pedido"
            className="mt-2"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Buscando..." : "Buscar pedido"}
        </Button>
      </div>
    </form>
  );
}