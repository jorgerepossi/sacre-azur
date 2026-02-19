"use client";

import { useState } from "react";

import { BookOpen, PackagePlus, Search, X } from "lucide-react";
import { toast } from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useAddFromCatalog } from "@/hooks/useAddFromCatalog";
import { useCatalogSearch } from "@/hooks/useCatalogSearch";
import { useFetchBrands } from "@/hooks/useFetchBrands";
import { useTenant } from "@/providers/TenantProvider";

import { CatalogPerfume } from "@/types/perfume.type";

interface CatalogSearchModalProps {
    open: boolean;
    onClose: () => void;
}

interface PriceFormProps {
    perfume: CatalogPerfume;
    isDecantSeller: boolean;
    onAdd: (data: { price: number; profit_margin?: number; size?: number }) => void;
    isPending: boolean;
}

function PriceForm({ perfume, isDecantSeller, onAdd, isPending }: PriceFormProps) {
    const [price, setPrice] = useState("");
    const [profitMargin, setProfitMargin] = useState("");
    const [size, setSize] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(price);
        if (!priceNum || priceNum <= 0) {
            toast.error("Ingresá un precio válido");
            return;
        }
        onAdd({
            price: priceNum,
            profit_margin: profitMargin ? parseFloat(profitMargin) : undefined,
            size: size ? parseFloat(size) : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                {perfume.image ? (
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                            src={perfume.image}
                            alt={perfume.name}
                            className="h-full w-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{perfume.name}</p>
                    <p className="text-sm text-muted-foreground">{perfume.brand?.name}</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                    <Label htmlFor="catalog-price">
                        {isDecantSeller ? "Precio (100ml)" : "Precio de Venta"}
                    </Label>
                    <Input
                        id="catalog-price"
                        type="number"
                        placeholder="400000"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </div>

                {isDecantSeller ? (
                    <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor="catalog-margin">Ganancia (%)</Label>
                        <Input
                            id="catalog-margin"
                            type="number"
                            placeholder="50"
                            value={profitMargin}
                            onChange={(e) => setProfitMargin(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col gap-1.5">
                        <Label htmlFor="catalog-size">Tamaño</Label>
                        <Select onValueChange={setSize} value={size}>
                            <SelectTrigger id="catalog-size">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="30">30ml</SelectItem>
                                <SelectItem value="50">50ml</SelectItem>
                                <SelectItem value="100">100ml</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            <Button type="submit" disabled={isPending} className="w-full">
                <PackagePlus className="mr-2 h-4 w-4" />
                {isPending ? "Agregando..." : "Agregar al inventario"}
            </Button>
        </form>
    );
}

export default function CatalogSearchModal({ open, onClose }: CatalogSearchModalProps) {
    const [selectedBrandId, setSelectedBrandId] = useState<string | undefined>(undefined);
    const { query, setQuery, results, isLoading } = useCatalogSearch(selectedBrandId);
    const addFromCatalog = useAddFromCatalog();
    const { tenant } = useTenant();
    const { data: brands } = useFetchBrands();
    const isDecantSeller = tenant?.product_type === "decant" || !tenant?.product_type;

    const [selectedPerfume, setSelectedPerfume] = useState<CatalogPerfume | null>(null);

    const handleClose = () => {
        setQuery("");
        setSelectedPerfume(null);
        setSelectedBrandId(undefined);
        onClose();
    };

    const handleAdd = (data: { price: number; profit_margin?: number; size?: number }) => {
        if (!selectedPerfume) return;
        addFromCatalog.mutate(
            { perfume_id: selectedPerfume.id, ...data },
            {
                onSuccess: () => {
                    toast.success(`"${selectedPerfume.name}" agregado al inventario`);
                    handleClose();
                },
                onError: (err: any) => {
                    toast.error(err?.message ?? "No se pudo agregar el producto");
                },
            },
        );
    };

    const hasActiveFilters = !!query || !!selectedBrandId;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Cargar desde catálogo
                    </DialogTitle>
                </DialogHeader>

                {selectedPerfume ? (
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => setSelectedPerfume(null)}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3.5 w-3.5" />
                            Volver a la búsqueda
                        </button>
                        <PriceForm
                            perfume={selectedPerfume}
                            isDecantSeller={isDecantSeller}
                            onAdd={handleAdd}
                            isPending={addFromCatalog.isPending}
                        />
                    </div>
                ) : (
                    <div className="flex min-h-0 flex-1 flex-col gap-4">
                        {/* Filtros */}
                        <div className="flex gap-2">
                            {/* Búsqueda por nombre */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    autoFocus
                                    className="pl-9"
                                    placeholder="Buscar por nombre..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>

                            {/* Filtro por marca */}
                            <Select
                                value={selectedBrandId ?? "all"}
                                onValueChange={(val) =>
                                    setSelectedBrandId(val === "all" ? undefined : val)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Todas las marcas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las marcas</SelectItem>
                                    {(brands ?? []).map((brand: any) => (
                                        <SelectItem key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Resultados */}
                        <div className="flex flex-col gap-2 overflow-y-auto">
                            {isLoading && (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    Buscando...
                                </p>
                            )}

                            {!isLoading && results.length === 0 && hasActiveFilters && (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    No se encontraron perfumes con esos filtros.
                                </p>
                            )}

                            {!isLoading && results.length === 0 && !hasActiveFilters && (
                                <p className="py-6 text-center text-sm text-muted-foreground">
                                    Seleccioná una marca o escribí un nombre para buscar.
                                </p>
                            )}

                            {results.map((perfume) => (
                                <button
                                    key={perfume.id}
                                    type="button"
                                    onClick={() => setSelectedPerfume(perfume)}
                                    className="flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {perfume.image ? (
                                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md">
                                            <img
                                                src={perfume.image}
                                                alt={perfume.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-muted">
                                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium">{perfume.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {perfume.brand?.name}
                                        </p>
                                        <div className="mt-1.5 flex flex-col gap-1.5">
                                            {/* Acordes */}
                                            {perfume.perfume_family_relation &&
                                                perfume.perfume_family_relation.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {perfume.perfume_family_relation.slice(0, 3).map((rel) => (
                                                            <Badge
                                                                key={rel.family_id}
                                                                variant="outline"
                                                                className="bg-primary/5 text-[10px] px-1.5 py-0 h-4 border-primary/20"
                                                            >
                                                                {rel.olfactive_families?.name}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                )}

                                            {/* Notas */}
                                            {perfume.perfume_note_relation &&
                                                perfume.perfume_note_relation.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {perfume.perfume_note_relation.slice(0, 4).map((rel) => (
                                                            <Badge
                                                                key={rel.note_id}
                                                                variant="secondary"
                                                                className="text-[10px] px-1.5 py-0 h-4"
                                                            >
                                                                {rel.perfume_notes?.name}
                                                            </Badge>
                                                        ))}
                                                        {perfume.perfume_note_relation.length > 4 && (
                                                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                                                                +{perfume.perfume_note_relation.length - 4}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
