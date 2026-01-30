import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface CorreoArgentinoSectionProps {
  enabled: boolean;
  username: string;
  password: string;
  accountNumber: string;
  onEnabledChange: (enabled: boolean) => void;
  onUsernameChange: (username: string) => void;
  onPasswordChange: (password: string) => void;
  onAccountNumberChange: (accountNumber: string) => void;
}

export default function CorreoArgentinoSection({
  enabled,
  username,
  password,
  accountNumber,
  onEnabledChange,
  onUsernameChange,
  onPasswordChange,
  onAccountNumberChange,
}: CorreoArgentinoSectionProps) {
  return (
    <div className="rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Correo Argentino</h3>
          <p className="text-sm text-muted-foreground">
            Configurá tus credenciales de e-PAQ
          </p>
        </div>
        <Switch checked={enabled} onCheckedChange={onEnabledChange} />
      </div>

      {enabled && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Usuario e-PAQ</Label>
              <Input
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
                placeholder="tu_usuario"
              />
            </div>

            <div className="space-y-2">
              <Label>Contraseña e-PAQ</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Número de cuenta</Label>
              <Input
                value={accountNumber}
                onChange={(e) => onAccountNumberChange(e.target.value)}
                placeholder="123456"
              />
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <p className="mb-1 font-semibold">¿Cómo obtener credenciales?</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                Registrate en
                <a
                  href="https://epaq.correoargentino.com.ar/"
                  target="_blank"
                  className="underline"
                >
                  e-PAQ
                </a>
              </li>
              <li>Verificá tu identidad y cuenta bancaria</li>
              <li>Obtené tus credenciales API</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
