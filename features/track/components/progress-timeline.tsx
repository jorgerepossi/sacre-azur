import Flex from "@/components/flex";
import { STATUS_INFO, STATUS_ORDER, OrderStatus } from "@/lib/tracking-status";

interface ProgressTimelineProps {
  currentStatus: OrderStatus;
}

export default function ProgressTimeline({ currentStatus }: ProgressTimelineProps) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus as any);

  return (
    <div className="border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Progreso del pedido</h3>
      <div className="space-y-3">
        {STATUS_ORDER.map((status, idx) => {
          const info = STATUS_INFO[status];
          const Icon = info.icon;
          const isPassed = idx <= currentIndex;

          return (
            <Flex key={status} className="items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                isPassed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={isPassed ? 'font-semibold' : 'text-muted-foreground'}>
                {info.label}
              </span>
            </Flex>
          );
        })}
      </div>
    </div>
  );
}