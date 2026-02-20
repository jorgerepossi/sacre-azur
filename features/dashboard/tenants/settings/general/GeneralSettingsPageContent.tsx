"use client";

import ContentBlock from "@/components/content-block";
import SmallLoader from "@/components/loaders/small";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGeneralSettings } from "./useGeneralSettings";

export default function GeneralSettingsPageContent() {
    const { config, setConfig, loading, saving, saveConfig } = useGeneralSettings();

    if (loading) return <SmallLoader />;

    return (
        <ContentBlock title="Configuración General">
            <div className="space-y-8">
                {/* Basic Info */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="store-name">Nombre de la Tienda</Label>
                        <Input
                            id="store-name"
                            value={config.name}
                            onChange={(e) => setConfig({ ...config, name: e.target.value })}
                            placeholder="Mi Perfumería"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="whatsapp">WhatsApp (incluir código de país)</Label>
                        <Input
                            id="whatsapp"
                            value={config.whatsapp_number}
                            onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                            placeholder="+54911..."
                        />
                    </div>
                </div>

                <hr className="border-muted" />

                {/* Decant Settings */}
                <div className="space-y-6">
                    <h3 className="text-lg font-medium">Configuración de Decants</h3>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Tamaño Mínimo de Decant</Label>
                            <Select
                                value={config.decant_min_size.toString()}
                                onValueChange={(val) => setConfig({ ...config, decant_min_size: Number(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="2">2 ml</SelectItem>
                                    <SelectItem value="2.5">2.5 ml (Estándar)</SelectItem>
                                    <SelectItem value="3">3 ml</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground">
                                Determina el tamaño más pequeño (excluyendo la opción de 1.2ml) que se mostrará en tu tienda.
                            </p>
                        </div>

                        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <Label className="text-base">Habilitar opción de 1.2 ml</Label>
                                <p className="text-sm text-muted-foreground">
                                    Muestra una opción de vial pequeño (1.2ml) para muestras.
                                </p>
                            </div>
                            <Switch
                                checked={config.has_1_2ml_option}
                                onCheckedChange={(checked) => setConfig({ ...config, has_1_2ml_option: checked })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={saveConfig} disabled={saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </div>
        </ContentBlock>
    );
}
