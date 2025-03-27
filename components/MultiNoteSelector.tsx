"use client";

import React, { useState } from "react";

import { X as IconClose } from "lucide-react";
import { Controller } from "react-hook-form";

import Flex from "@/components/flex";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

type Note = {
  id: string;
  name: string;
};

type Props = {
  control: any;
  name: string;
  notes: Note[];
};

export default function MultiNoteSelector({ control, name, notes }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNote = (currentValue: string[], id: string) => {
    const updated = currentValue.includes(id)
      ? currentValue.filter((item) => item !== id)
      : [...currentValue, id];
    return updated;
  };

  const handleRemoveNote = (currentValue: string[], id: string) => {
    return currentValue.filter((item) => item !== id);
  };

  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      render={({ field: { value, onChange } }) => {
        const selectedIds = new Set(value || []);
        const selectedNotes = notes.filter((note) => selectedIds.has(note.id));

        return (
          <div className="space-y-2">
            <Select open={isOpen} onOpenChange={setIsOpen} value={value}>
              <SelectTrigger onClick={() => setIsOpen(!isOpen)}>
                Seleccionar notas
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {notes.map((note) => (
                    <SelectItem
                      key={note.id}
                      value={note.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        const newValue = toggleNote(value || [], note.id);
                        onChange(newValue);
                      }}
                      className={cn(
                        "cursor-pointer",
                        selectedIds.has(note.id) && "bg-muted font-semibold",
                      )}
                    >
                      {note.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {selectedNotes.length > 0 && (
              <Flex className="mt-2 flex-wrap gap-x-[1rem] gap-y-[1rem] py-[1rem]">
                {selectedNotes.map((note) => (
                  <Flex
                    key={note.id}
                    className="flex items-center gap-1 rounded-full border bg-muted px-[16px]"
                  >
                    {note.name}
                    <Flex
                      onClick={() =>
                        onChange(handleRemoveNote(value || [], note.id))
                      }
                      className={`${cn(buttonVariants({ variant: "ghost" }))} w-[24px] !p-0 text-xs`}
                    >
                      <IconClose size={"12px"} />
                    </Flex>
                  </Flex>
                ))}
              </Flex>
            )}
          </div>
        );
      }}
    />
  );
}
