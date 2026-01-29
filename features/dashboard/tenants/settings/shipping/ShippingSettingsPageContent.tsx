"use client";

import { Button } from "@/components/ui/button";
import ContentBlock from "@/components/content-block";
import SmallLoader from "@/components/loaders/small";
import { useShippingConfig } from "./hooks/useShippingConfig";
import CorreoArgentinoSection from "./components/correo-argentino-section";
import OriginAddressSection from "./components/origin-address-section";

export default function ShippingSettingsPageContent() {
  const { config, setConfig, loading, saving, saveConfig } = useShippingConfig();

  if (loading) return <SmallLoader />;

  return (
    <ContentBlock title="Configuración de Envíos">
      <div className="space-y-6">
        <CorreoArgentinoSection
          enabled={config.correo_argentino_enabled}
          username={config.correo_argentino_username}
          password={config.correo_argentino_password}
          accountNumber={config.correo_argentino_account_number}
          onEnabledChange={(enabled) =>
            setConfig({ ...config, correo_argentino_enabled: enabled })
          }
          onUsernameChange={(username) =>
            setConfig({ ...config, correo_argentino_username: username })
          }
          onPasswordChange={(password) =>
            setConfig({ ...config, correo_argentino_password: password })
          }
          onAccountNumberChange={(accountNumber) =>
            setConfig({ ...config, correo_argentino_account_number: accountNumber })
          }
        />

        <OriginAddressSection
          address={config.origin_address}
          city={config.origin_city}
          province={config.origin_province}
          postalCode={config.origin_postal_code}
          onAddressChange={(address) => setConfig({ ...config, origin_address: address })}
          onCityChange={(city) => setConfig({ ...config, origin_city: city })}
          onProvinceChange={(province) => setConfig({ ...config, origin_province: province })}
          onPostalCodeChange={(postalCode) =>
            setConfig({ ...config, origin_postal_code: postalCode })
          }
        />

        <div className="flex justify-end">
          <Button onClick={saveConfig} disabled={saving}>
            {saving ? "Guardando..." : "Guardar configuración"}
          </Button>
        </div>
      </div>
    </ContentBlock>
  );
}