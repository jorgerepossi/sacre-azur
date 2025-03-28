"use client";

import { ImageUp } from "lucide-react";
import { Controller } from "react-hook-form";

import BrandSelectOptions from "@/components/brand-select-options";
import Flex from "@/components/flex";
import MultiNoteSelector from "@/components/MultiNoteSelector";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePerfumeForm } from "@/hooks/useCreatePerfumeForm";

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
    orderNotes,
    createPerfume,
    handleImageChange,
    handleIconClick,
    handleOnSubmit,
  } = useCreatePerfumeForm();

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
                <Flex className="w-full flex-col gap-[1rem]">
                  <Label>Select Brand</Label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
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
              <Flex className="w-full flex-col gap-[1rem]">
                <Label htmlFor="external_link">External Link</Label>
                <Input
                  {...field}
                  type="text"
                  id="external_link"
                  placeholder="External Link"
                />
              </Flex>
            )}
          />
          <Controller
            name="note_ids"
            control={control}
            render={({ field }) => (
              <Flex className="flex-col gap-[1rem]">
                <MultiNoteSelector
                  control={control}
                  name="note_ids"
                  notes={orderNotes ?? []}
                  selectedNotes={field.value || []}
                  onNotesChange={field.onChange}
                />
              </Flex>
            )}
          />

          <Flex className="gap-[1rem]">
            <Button
              type="button"
              variant="outline"
              onClick={handleIconClick}
              className={"flex gap-[1rem]"}
            >
              <ImageUp className="h-6 w-6" /> Upload image
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
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 w-32 object-cover"
            />
          )}
        </Flex>

        <Button type="submit" disabled={createPerfume.isPending}>
          {createPerfume.isPending ? "Saving..." : "Create New"}
        </Button>
      </Flex>
    </form>
  );
};

export default CreateForm;
