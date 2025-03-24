"use client";
import React from "react";
import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,

    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ImageUp } from "lucide-react";
import { Label } from "@/components/ui/label";

import RichTextEditor from "@/components/rich-text-editor";
import { Controller } from "react-hook-form";
import { useCreatePerfumeForm } from "@/hooks/useCreatePerfumeForm";
import BrandSelectOptions from "@/components/brand-select-options";

const CreateForm = () => {
    const {
        control,
        handleSubmit,
        register,
        preview,
        handleImageChange,
        handleIconClick,
        handleOnSubmit,
        brands,
        isLoading,
        error,
        fileInputRef,
        createPerfume,
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
