import { Loader2 } from "lucide-react";

import Flex from "@/components/flex";

export default function LoadingState() {
  return (
    <Flex className="h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-lg">Loading orders...</span>
    </Flex>
  );
}
