import Flex from "@/components/flex";

import { OrderStatus, STATUS_INFO } from "@/lib/tracking-status";

interface StatusCardProps {
  status: OrderStatus;
}

export default function StatusCard({ status }: StatusCardProps) {
  const statusInfo = STATUS_INFO[status] || STATUS_INFO.PENDIENTE;
  const StatusIcon = statusInfo.icon;

  return (
    <div
      className={`${statusInfo.bgColorClass} ${statusInfo.borderColorClass} border-2 ${statusInfo.colorClass} rounded-lg p-6`}
    >
      <Flex className="mb-2 items-center gap-3">
        <StatusIcon className="h-8 w-8" />
        <h2 className="text-2xl font-bold">{statusInfo.label}</h2>
      </Flex>
      <p className="text-sm opacity-90">{statusInfo.description}</p>
    </div>
  );
}
