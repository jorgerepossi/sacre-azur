import { Check } from "lucide-react";

const BrandItem = ({
  brand,
  selected,
  onToggle,
}: {
  brand: any;
  selected: boolean;
  onToggle: (id: string) => void;
}) => (
  <div className="flex items-center pb-[1rem] ">
    <button
      className="flex w-full items-center gap-2 text-sm  hover:text-primary text-neutral-500 transition-all"
      onClick={() => onToggle(brand.id)}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded border border-primary">
        {selected && <Check className="h-3 w-3 text-primary" />}
      </div>
      <span className="truncate">{brand.name}</span>
    </button>
  </div>
);

export default BrandItem;
