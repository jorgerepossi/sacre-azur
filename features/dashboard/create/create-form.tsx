"use client";

import React from "react";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useCreatePerfumeForm } from "@/hooks/useCreatePerfumeForm";
import { useTenant } from "@/providers/TenantProvider";

import ImageCropModal from "../edit/components/image-crop-modal";
import PricePreview from "../edit/components/price-preview";
import UseExistingPerfumeModal from "./use-existing-perfume-modal";

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
    orderFamilies,
    createPerfume,
    handleImageChange,
    handleIconClick,
    handleOnSubmit,
    showCropModal,
    tempImageSrc,
    handleCropComplete,
    setShowCropModal,
    showExistingModal,
    setShowExistingModal,
    existingPerfumeData,
    handleUseExistingPerfume,
    setExistingPerfumeData,
    isAddingExisting,
  } = useCreatePerfumeForm();

  const { tenant } = useTenant();
  const isDecantSeller = tenant?.product_type === "decant" || !tenant?.product_type;

  if (isLoading || error || !brands) return null;

  return (
    <>
      <form onSubmit={handleSubmit(handleOnSubmit)} className="max-w-[700px]">
        <Flex className="flex-col gap-[4rem]">
          <Flex className="flex-col gap-[1.5rem]">
            <Controller
              control={control}
              name="name"
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field }) => (
                <Flex className="flex-col gap-[1rem]">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    {...field}
                    id="name"
                    type="text"
                    placeholder="Ej: Lune Feline"
                  />
                </Flex>
              )}
            />

            <Controller
              control={control}
              name="description"
              defaultValue=""
              render={({ field }) => (
                <Flex className="flex-col gap-[1rem]">
                  <Label htmlFor="description">Descripción</Label>
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
                    <Label htmlFor="price">{isDecantSeller ? "Precio (100ml)" : "Precio de Venta"}</Label>
                    <Input
                      {...field}
                      type="number"
                      id="price"
                      placeholder="400000"
                    />
                  </Flex>
                )}
              />
              {isDecantSeller ? (
                <Controller
                  control={control}
                  name="profit_margin"
                  render={({ field }) => (
                    <Flex className="flex-col gap-[1rem]">
                      <Label htmlFor="profit">Ganancia (%)</Label>
                      <Input
                        {...field}
                        type="number"
                        id="profit"
                        placeholder="50"
                      />
                    </Flex>
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name="size"
                  render={({ field }) => (
                    <Flex className="flex-col gap-[1rem]">
                      <Label htmlFor="size">Tamaño</Label>
                      <Select
                        onValueChange={(val) => field.onChange(Number(val))}
                        value={field.value?.toString() ?? ""}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30ml</SelectItem>
                          <SelectItem value="50">50ml</SelectItem>
                          <SelectItem value="100">100ml</SelectItem>
                        </SelectContent>
                      </Select>
                    </Flex>
                  )}
                />
              )}

              <Controller
                control={control}
                name="brand_id"
                render={({ field }) => (
                  <Flex className="w-full flex-col gap-[1rem]">
                    <Label>Seleccionar Marca</Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Amouage..." />
                      </SelectTrigger>
                      <SelectContent>
                        <BrandSelectOptions brands={brands} />
                      </SelectContent>
                    </Select>
                  </Flex>
                )}
              />
            </Flex>
            {isDecantSeller && <PricePreview control={control} />}
            <Controller
              control={control}
              name="external_link"
              render={({ field }) => (
                <Flex className="w-full flex-col gap-[1rem]">
                  <Label htmlFor="external_link"> Link Externo</Label>
                  <Input
                    {...field}
                    type="text"
                    id="external_link"
                    placeholder="https://fragrantica.com"
                  />
                </Flex>
              )}
            />
            <Controller
              control={control}
              name="family_ids"
              render={({ field }) => (
                <Flex className="flex-col gap-[1rem]">
                  <Label htmlFor="family_ids">Acordes Principales</Label>
                  <MultiNoteSelector
                    control={control}
                    name="family_ids"
                    notes={orderFamilies ?? []}
                    selectedNotes={field.value || []}
                    onNotesChange={field.onChange}
                  />
                </Flex>
              )}
            />

            <Controller
              control={control}
              name="top_note_ids"
              render={({ field }) => (
                <Flex className="flex-col gap-[1rem]">
                  <Label htmlFor="top_note_ids">Notas de Salida (Top Notes)</Label>
                  <MultiNoteSelector
                    control={control}
                    name="top_note_ids"
                    notes={orderNotes ?? []}
                    selectedNotes={field.value || []}
                    onNotesChange={field.onChange}
                  />
                </Flex>
              )}
            />

            <Controller
              name="heart_note_ids"
              control={control}
              render={({ field }) => (
                <Flex className="flex-col gap-[1rem]">
                  <Label htmlFor="heart_note_ids">Notas de Corazón (Heart Notes)</Label>
                  <MultiNoteSelector
                    control={control}
                    name="heart_note_ids"
                    notes={orderNotes ?? []}
                    selectedNotes={field.value || []}
                    onNotesChange={field.onChange}
                  />
                </Flex>
              )}
            />

            <Controller
              name="base_note_ids"
              control={control}
              render={({ field }) => (
                <Flex className="flex-col gap-[1rem]">
                  <Label htmlFor="base_note_ids">Notas de Fondo (Base Notes)</Label>
                  <MultiNoteSelector
                    control={control}
                    name="base_note_ids"
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
                <ImageUp className="h-6 w-6" /> Subir imagen
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
            {createPerfume.isPending ? "Guardando..." : "Crear Nuevo"}
          </Button>
        </Flex>
      </form>

      {showCropModal && tempImageSrc && (
        <ImageCropModal
          open={showCropModal}
          imageSrc={tempImageSrc}
          onClose={() => setShowCropModal(false)}
          onCropComplete={handleCropComplete}
        />
      )}

      {existingPerfumeData && (
        <UseExistingPerfumeModal
          open={showExistingModal}
          perfumeName={existingPerfumeData.name}
          brandName={existingPerfumeData.brandName}
          onConfirm={handleUseExistingPerfume}
          onCancel={() => {
            setShowExistingModal(false);
            setExistingPerfumeData(null);
          }}
          isLoading={isAddingExisting}
        />
      )}
    </>
  );
};

export default CreateForm;