"use client";

import React, { createContext, useState, ReactNode } from "react";

interface NoteFilterContextType {
  selectedNotes: string[];
  toggleNote: (noteId: string) => void;
  clearNotes: () => void;
}

export const NoteFilterContext = createContext<NoteFilterContextType>({
  selectedNotes: [],
  toggleNote: () => {},
  clearNotes: () => {},
});

export const NoteFilterProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);

  const toggleNote = (noteId: string) => {
    setSelectedNotes((prev) =>
      prev.includes(noteId)
        ? prev.filter((id) => id !== noteId)
        : [...prev, noteId]
    );
  };

  const clearNotes = () => {
    setSelectedNotes([]);
  };

  return (
    <NoteFilterContext.Provider value={{ selectedNotes, toggleNote, clearNotes }}>
      {children}
    </NoteFilterContext.Provider>
  );
};