import Flex from "@/components/flex";
import { STATUS_INFO, OrderStatus } from "@/lib/tracking-status";

interface StatusCardProps {
  status: OrderStatus;
}

export default function StatusCard({ status }: StatusCardProps) {
  const statusInfo = STATUS_INFO[status] || STATUS_INFO.PENDIENTE;
  const StatusIcon = statusInfo.icon;

  return (
    <div className={`${statusInfo.bgColorClass} ${statusInfo.borderColorClass} border-2 ${statusInfo.colorClass} p-6 rounded-lg`}>
      <Flex className="items-center gap-3 mb-2">
        <StatusIcon className="h-8 w-8" />
        <h2 className="text-2xl font-bold">{statusInfo.label}</h2>
      </Flex>
      <p className="text-sm opacity-90">{statusInfo.description}</p>
    </div>
  );
}