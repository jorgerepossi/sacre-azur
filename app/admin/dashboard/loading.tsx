import Flex from "@/components/flex";
import SmallLoader from "@/components/loaders/small";

export default function Loading() {
  return (
    <Flex className="min-h-[40vh] items-center justify-center">
      <SmallLoader />
    </Flex>
  );
}
