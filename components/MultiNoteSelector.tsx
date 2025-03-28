"use client";

import { X } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Note = {
  id: number;
  name: string;
};

type Props = {
  control: any;
  name: string;
  notes: Note[];
  selectedNotes: string[];
  onNotesChange: (value: string[]) => void;
};

export default function MultiNoteSelector({
  name,
  notes,
  selectedNotes,
  onNotesChange,
  control,
}: Props) {
  const addNote = (noteId: string) => {
    if (!selectedNotes?.includes(noteId)) {
      onNotesChange([...selectedNotes, noteId]);
    }
  };

  const removeNote = (noteId: string) => {
    onNotesChange(selectedNotes.filter((id) => id !== noteId));
  };

  return (
    <div className="space-y-2">
      <Controller
        name={name}
        control={control}
        render={() => (
          <>
            <Select onValueChange={addNote}>
              <SelectTrigger>
                <SelectValue placeholder="Select notes..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {notes.map((note) => (
                    <SelectItem
                      key={note.id}
                      value={note.id.toString()}
                      disabled={selectedNotes?.includes(note.id.toString())}
                    >
                      {note.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div className="mt-2 flex flex-wrap gap-2 py-6">
              {selectedNotes?.map((noteId) => {
                const note = notes.find((n) => n.id.toString() === noteId);
                return (
                  <div
                    key={noteId}
                    className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    <span>{note?.name}</span>
                    <button
                      type="button"
                      onClick={() => removeNote(noteId)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      />
    </div>
  );
}
