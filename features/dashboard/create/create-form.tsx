"use client";
import { useEffect, useState } from "react";
import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent, SelectTrigger,
    SelectValue,
    SelectGroup, SelectItem
} from "@/components/ui/select";
import {  ImageUp} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { X } from "lucide-react";

import RichTextEditor from "@/components/rich-text-editor";
import { Controller } from "react-hook-form";
import { useCreatePerfumeForm } from "@/hooks/useCreatePerfumeForm";
import BrandSelectOptions from "@/components/brand-select-options";
import MultiNoteSelector from "@/components/MultiNoteSelector";


type Note = {
    id: string;
    name: string;
};

const CreateForm = () => {
    const {
        notes,
        error,
        brands,
        control,
        preview,
        register,
        isLoading,
        handleSubmit,
        fileInputRef,
        createPerfume,
        handleImageChange,
        handleIconClick,
        handleOnSubmit,
    } = useCreatePerfumeForm();

    const [selectedNotes, setSelectedNotes] = useState<Note[]>([]);

    const handleRemoveNote = (id: string) => {
        setSelectedNotes((prev) => prev.filter((note) => note.id !== id));
    };


    if (isLoading || error || !brands) return null;



    return (
        <form onSubmit={handleSubmit(handleOnSubmit)} className="max-w-[700px]">
            <Flex className="flex-col gap-[4rem]">
                <Flex className="flex-col gap-[1.5rem]">
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: "El nombre es obligatorio" }}
                        render={({ field }) => (
                            <Flex className="flex-col gap-[1rem]">
                                <Label htmlFor="name">Name</Label>
                                <Input {...field} id="name" type="text" placeholder="Name" />
                            </Flex>
                        )}
                    />

                    <Controller
                        control={control}
                        name="description"
                        defaultValue=""
                        render={({ field }) => (
                            <Flex className="flex-col gap-[1rem]">
                                <Label htmlFor="description">Description</Label>
                                <RichTextEditor value={field.value} onChange={field.onChange} />
                            </Flex>
                        )}
                    />

                    <Flex className="gap-[1rem]">
                        <Controller
                            control={control}
                            name="price"
                            render={({ field }) => (
                                <Flex className="flex-col gap-[1rem]">
                                    <Label htmlFor="price">Price</Label>
                                    <Input {...field} type="number" id="price" />
                                </Flex>
                            )}
                        />
                        <Controller
                            control={control}
                            name="profit_margin"
                            render={({ field }) => (
                                <Flex className="flex-col gap-[1rem]">
                                    <Label htmlFor="profit">Profit</Label>
                                    <Input {...field} type="number" id="profit" />
                                </Flex>
                            )}
                        />

                        <Controller
                            control={control}
                            name="brand_id"
                            render={({ field }) => (
                                <Flex className="flex-col gap-[1rem] w-full">
                                    <Label>Select Brand</Label>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose Brand" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <BrandSelectOptions brands={brands} />
                                        </SelectContent>
                                    </Select>
                                </Flex>
                            )}
                        />
                    </Flex>

                    <Controller
                        control={control}
                        name="external_link"
                        render={({ field }) => (
                            <Flex className="flex-col gap-[1rem] w-full">
                                <Label htmlFor="external_link">External Link</Label>
                                <Input {...field} type="text" id="external_link" placeholder="External Link" />
                            </Flex>
                        )}
                    />

                    <Flex className="flex-col gap-[1rem]">
                        <MultiNoteSelector
                            control={control}
                            name="note_ids"
                            notes={notes || []}
                            onSelectionChange={setSelectedNotes}
                        />

                        {selectedNotes.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedNotes.map((note) => (
                                    <Badge
                                        key={note.id}
                                        variant="secondary"
                                        className="flex items-center gap-1 pr-2"
                                    >
                                        {note.name}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNote(note.id)}
                                            className="ml-1 text-xs text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}

                    </Flex>

                    <Flex className="gap-[1rem]">
                        <Button type="button" variant="outline" onClick={handleIconClick} className={'flex gap-[1rem]'}>
                            <ImageUp className="w-6 h-6" /> Upload image
                        </Button>
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            {...register("image", { required: true })}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />
                    </Flex>
                    {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2" />}
                </Flex>

                <Button type="submit" disabled={createPerfume.isPending}>
                    {createPerfume.isPending ? "Saving..." : "Create New"}
                </Button>
            </Flex>
        </form>
    );
};

export default CreateForm;
