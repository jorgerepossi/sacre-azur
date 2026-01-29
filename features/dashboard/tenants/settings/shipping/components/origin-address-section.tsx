import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OriginAddressSectionProps {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  onAddressChange: (address: string) => void;
  onCityChange: (city: string) => void;
  onProvinceChange: (province: string) => void;
  onPostalCodeChange: (postalCode: string) => void;
}

export default function OriginAddressSection({
  address,
  city,
  province,
  postalCode,
  onAddressChange,
  onCityChange,
  onProvinceChange,
  onPostalCodeChange,
}: OriginAddressSectionProps) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Dirección de origen</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Desde dónde enviás tus pedidos (para calcular costos)
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Dirección completa</Label>
          <Input
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Av. Corrientes 1234"
          />
        </div>

        <div className="space-y-2">
          <Label>Ciudad</Label>
          <Input
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="CABA"
          />
        </div>

        <div className="space-y-2">
          <Label>Provincia</Label>
          <Input
            value={province}
            onChange={(e) => onProvinceChange(e.target.value)}
            placeholder="Buenos Aires"
          />
        </div>

        <div className="space-y-2">
          <Label>Código Postal</Label>
          <Input
            value={postalCode}
            onChange={(e) => onPostalCodeChange(e.target.value)}
            placeholder="1414"
          />
        </div>
      </div>
    </div>
  );
}