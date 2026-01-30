"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Controller } from "react-hook-form";

import BrandSelectOptions from "@/components/brand-select-options";
import Flex from "@/components/flex";
import MultiNoteSelector from "@/components/MultiNoteSelector";
import RichTextEditor from "@/components/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import { useEditPerfume } from "@/hooks/useEditPerfume";
import PricePreview from "./components/price-preview";

import { useTenantUrl } from "@/hooks/useTenantUrl";
import {  ImageUp } from "lucide-react";
import EditPerfumeSkeleton from "./components/edit-form-skeleton";
import Box from "@/components/box";
import ImageCropModal from "./components/image-crop-modal";

export default function EditPerfumeContent() {
  const router = useRouter();
  const {
    brands,
    control,
    loading,
    preview,
    onSubmit,
    isPending,
    orderNotes,
    fileInputRef,
    handleSubmit,
    handleIconClick,
    handleImageChange,
    tempImageSrc,
    showCropModal,
    setShowCropModal,
    handleCropComplete,
  } = useEditPerfume();
  const { tenant } = useTenantUrl()

  if (isPending || !brands) {
    return <EditPerfumeSkeleton />;
  }

  const handleCancel = () => {
    router.push(`/${tenant}/dashboard`);
  };

  return (
    <Card className="mx-auto  gap-[2rem] p-[1.5rem]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-[2rem]"
      >
        <Flex className="justify-between items-center">
          <h2 className="mb-4 text-2xl font-bold">Edit Perfume</h2>
          <Controller
            name="in_stock"
            control={control}
            render={({ field }) => (
              <Flex className="items-center gap-2">
                <Label htmlFor="in_stock">En Stock</Label>
                <Switch
                  id="in_stock"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </Flex>
            )}
          />
        </Flex>
        <Box className="grid grid-cols-1  md:grid-cols-2 gap-[2rem] ">
          <Flex className="flex-col gap-[2rem] flex-2">

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Flex className={"w-full flex-col gap-[1rem]"}>
                  <Label htmlFor={"name"} className={"text-muted-foreground"}>
                    Name
                  </Label>
                  <Input {...field} id={"name"} type="text" placeholder="Name" />
                </Flex>
              )}
            />
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Flex className={"w-full flex-col gap-[1rem]"}>
                  <Label
                    htmlFor={"description"}
                    className={"text-muted-foreground"}
                  >
                    Description
                  </Label>
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                </Flex>
              )}
            />
            <Flex className="gap-4">
              <Flex className={"flex-col gap-[1rem]"}>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Flex className={"w-full flex-col gap-[1rem]"}>
                      <Label htmlFor={"price"} className={"text-muted-foreground"}>
                        Price
                      </Label>
                      <Input
                        {...field}
                        id={"price"}
                        type="number"
                        placeholder="Price"
                      />
                    </Flex>
                  )}
                />
              </Flex>
              <Flex className={"flex-col gap-[1rem]"}>
                <Controller
                  name="profit_margin"
                  control={control}
                  render={({ field }) => (
                    <Flex className={"w-full flex-col gap-[1rem]"}>
                      <Label htmlFor={"profit"} className={"text-muted-foreground"}>
                        Profit
                      </Label>
                      <Input
                        {...field}
                        id={"profit"}
                        type="number"
                        placeholder="Profit"
                      />
                    </Flex>
                  )}
                />
              </Flex>

              <Controller
                control={control}
                name="brand_id"
                rules={{ required: "Choose Brand" }}
                render={({ field }) => (
                  <Flex className={"w-full flex-col gap-[1rem]"}>
                    <Label htmlFor={"brand_id"} className={"text-muted-foreground"}>
                      Change Brand
                    </Label>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || brands?.[0]?.id}
                    >
                      <SelectTrigger className="rounded border p-2">
                        <SelectValue placeholder="Select a Brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <BrandSelectOptions brands={brands} />
                      </SelectContent>
                    </Select>
                  </Flex>
                )}
              />
            </Flex>
            <PricePreview control={control} />
          </Flex>
          {/* end block one */}
          <Flex className="flex-col gap-[2rem] flex-2">
            <Controller
              name="note_ids"
              control={control}
              render={({ field }) => (
                <Flex className="flex-col gap-[1rem]">
                  <Label className="text-muted-foreground">Acordes principales</Label>
                  <MultiNoteSelector
                    control={control}
                    name="note_ids"
                    notes={orderNotes}
                    selectedNotes={field.value || []}
                    onNotesChange={field.onChange}
                  />
                </Flex>
              )}
            />

{showCropModal && tempImageSrc && (
  <ImageCropModal
    open={showCropModal}
    imageSrc={tempImageSrc}
    onClose={() => setShowCropModal(false)}
    onCropComplete={handleCropComplete}
  />
)}

            <Flex className="gap-[1rem] flex-col">
              <Button
                type="button"
                variant="outline"
                className={"flex gap-[1rem]"}
                onClick={handleIconClick}
              >
                <ImageUp className="h-6 w-6" /> Actualizar Imagen
              </Button>
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="rounded border p-2"
              />

              {preview && (
                <Flex className="justify-center items-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-2 h-32 w-32 object-cover"
                  />
                </Flex>
              )}
            </Flex>

          </Flex>
          {/* end block two*/}
        </Box>
        <Controller
          name="external_link"
          control={control}
          render={({ field }) => (
            <Flex className={"w-full flex-col gap-[1rem]"}>
              <Label
                htmlFor={"external_link"}
                className={"text-muted-foreground"}
              >
                Link Externo
              </Label>
              <Input
                {...field}
                id={"external_link"}
                type="text"
                placeholder="External Link"
              />
            </Flex>
          )}
        />

        <Flex className={"w-full gap-[1rem]"}>
          <Button
            type={"button"}
            variant={"outline"}
            className={"flex-1"}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className={"flex-1"}>
            {loading ? "Guardando..." : "Actualizar Perfume"}
          </Button>
        </Flex>
      </form>
    </Card>
  );
}
