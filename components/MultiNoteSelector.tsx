"use client";

import { Controller } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import Flex from "@/components/flex";

type Note = {
    id: string;
    name: string;
};

type Props = {
    control: any;
    name: string;
    notes: Note[];

    onSelectionChange?: (selectedNotes: Note[]) => void;
};

export default function MultiNoteSelector({ control, name, notes,   onSelectionChange, }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const selectedIds = new Set(Array.isArray(field.value) ? field.value : []);

                const toggleNote = (id: string) => {
                    const updated = new Set(selectedIds);
                    updated.has(id) ? updated.delete(id) : updated.add(id);
                    field.onChange(Array.from(updated));


                    if (onSelectionChange) {
                        const selectedNotes = notes.filter((note) => updated.has(note.id));
                        onSelectionChange(selectedNotes);
                    }
                };
                return (
                    <Flex className="space-y-2 gap-4 flex-col">
                        <Select
                            open={isOpen}
                            onOpenChange={setIsOpen}
                        >
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
                                                toggleNote(note.id);
                                            }}
                                            className={cn(
                                                "cursor-pointer",
                                                selectedIds.has(note.id) && "font-semibold bg-muted-foreground"
                                            )}
                                        >
                                            {note.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Flex>
                );
            }}
        />
    );
}