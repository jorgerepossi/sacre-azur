import { Check } from "lucide-react";

const NoteItem = ({
  note,
  selected,
  onToggle,
}: {
  note: any;
  selected: boolean;
  onToggle: (id: string) => void;
}) => (
  <div className="flex items-center pb-[1rem]">
    <button
      className="flex w-full items-center gap-2 text-sm text-neutral-500 transition-all hover:text-primary"
      onClick={() => onToggle(note.id.toString())}
    >
      <div className="flex h-4 w-4 items-center justify-center rounded border border-primary">
        {selected && <Check className="h-3 w-3 text-primary" />}
      </div>
      <span className="truncate">{note.name}</span>
    </button>
  </div>
);

export default NoteItem;
