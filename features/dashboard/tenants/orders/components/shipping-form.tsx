"use client";

import { useEffect, useState } from "react";

import { toast } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { OrderShipping, SHIPPING_METHODS } from "@/types/order-shipping.type";

import { supabase } from "@/lib/supabaseClient";

interface ShippingFormProps {
  orderId: string;
  existingShipping?: OrderShipping | null;
  onSuccess?: () => void;
}

export default function ShippingForm({
  orderId,
  existingShipping,
  onSuccess,
}: ShippingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: existingShipping?.shipping_address || "",
    shipping_province: existingShipping?.shipping_province || "",
    shipping_city: existingShipping?.shipping_city || "",
    shipping_postal_code: existingShipping?.shipping_postal_code || "",
    shipping_method: existingShipping?.shipping_method || "",
    shipping_cost: existingShipping?.shipping_cost?.toString() || "",
    tracking_number: existingShipping?.tracking_number || "",
    internal_notes: existingShipping?.internal_notes || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generar tracking URL si hay número de tracking
      let tracking_url = null;
      if (formData.tracking_number && formData.shipping_method) {
        const method =
          SHIPPING_METHODS[
            formData.shipping_method as keyof typeof SHIPPING_METHODS
          ];
        if (method.trackingUrl) {
          tracking_url = method.trackingUrl(formData.tracking_number);
        }
      }

      const shippingData = {
        order_id: orderId,
        shipping_address: formData.shipping_address || null,
        shipping_province: formData.shipping_province || null,
        shipping_city: formData.shipping_city || null,
        shipping_postal_code: formData.shipping_postal_code || null,
        shipping_method: formData.shipping_method || null,
        shipping_cost: formData.shipping_cost
          ? parseFloat(formData.shipping_cost)
          : null,
        tracking_number: formData.tracking_number || null,
        tracking_url: tracking_url,
        internal_notes: formData.internal_notes || null,
      };

      if (existingShipping) {
        // Actualizar
        const { error } = await supabase
          .from("order_shipping")
          .update(shippingData)
          .eq("order_id", orderId);

        if (error) throw error;
      } else {
        // Crear
        const { error } = await supabase
          .from("order_shipping")
          .insert([shippingData]);

        if (error) throw error;
      }

      toast.success("Información de envío guardada");
      onSuccess?.();
    } catch (error) {
      console.error("Error saving shipping:", error);
      toast.error("Error al guardar la información");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="address">Dirección completa</Label>
          <Input
            id="address"
            value={formData.shipping_address}
            onChange={(e) =>
              setFormData({ ...formData, shipping_address: e.target.value })
            }
            placeholder="Calle 123, Piso 4, Dpto B"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            value={formData.shipping_city}
            onChange={(e) =>
              setFormData({ ...formData, shipping_city: e.target.value })
            }
            placeholder="CABA"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province">Provincia</Label>
          <Input
            id="province"
            value={formData.shipping_province}
            onChange={(e) =>
              setFormData({ ...formData, shipping_province: e.target.value })
            }
            placeholder="Buenos Aires"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal">Código Postal</Label>
          <Input
            id="postal"
            value={formData.shipping_postal_code}
            onChange={(e) =>
              setFormData({ ...formData, shipping_postal_code: e.target.value })
            }
            placeholder="1234"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Método de envío</Label>
          <Select
            value={formData.shipping_method}
            onValueChange={(value) =>
              setFormData({ ...formData, shipping_method: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SHIPPING_METHODS).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cost">Costo de envío ($)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.shipping_cost}
            onChange={(e) =>
              setFormData({ ...formData, shipping_cost: e.target.value })
            }
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tracking">Número de seguimiento</Label>
          <Input
            id="tracking"
            value={formData.tracking_number}
            onChange={(e) =>
              setFormData({ ...formData, tracking_number: e.target.value })
            }
            placeholder="ABC123456789"
          />
          {formData.tracking_number && formData.shipping_method && (
            <p className="text-xs text-muted-foreground">
              Se generará automáticamente el link de tracking
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Notas internas</Label>
          <Textarea
            id="notes"
            value={formData.internal_notes}
            onChange={(e) =>
              setFormData({ ...formData, internal_notes: e.target.value })
            }
            placeholder="Notas privadas sobre el envío..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t pt-4">
        <Button type="submit" disabled={loading}>
          {loading
            ? "Guardando..."
            : existingShipping
              ? "Actualizar"
              : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
