"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Flex from "@/components/flex";

type UseExistingPerfumeModalProps = {
    open: boolean;
    perfumeName: string;
    brandName: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
};

export default function UseExistingPerfumeModal({
    open,
    perfumeName,
    brandName,
    onConfirm,
    onCancel,
    isLoading,
}: UseExistingPerfumeModalProps) {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Perfume ya existe</DialogTitle>
                    <DialogDescription>
                        El perfume <strong>{perfumeName}</strong> de <strong>{brandName}</strong> ya está en el catálogo.
                    </DialogDescription>
                </DialogHeader>

                <Flex className="flex-col gap-[1rem] py-4">
                    <p className="text-sm text-secondary_text_dark">
                        ¿Deseas usar el perfume existente y agregarlo a tu inventario con los precios que especificaste?
                    </p>
                </Flex>

                <DialogFooter className="flex gap-[1rem]">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? "Agregando..." : "Usar perfume existente"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}