"use client";

import React, {useRef, useState} from "react";
import {useForm} from "react-hook-form";
import {useCreateBrand} from "@/hooks/useCreateBrand";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import Flex from "@/components/flex";
import {toast} from "react-hot-toast";
import {Label} from "@/components/ui/label";
import {ImageUp} from "lucide-react";

type FormValues = {
    name: string;
    image: FileList;
};

export default function CreateBrandForm() {
    const createBrand = useCreateBrand();
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: {errors},
    } = useForm<FormValues>();
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setPreview(URL.createObjectURL(file));
            setValue("image", files);
            trigger("image");
        }
    };

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const onSubmit = (data: FormValues) => {
        const imageFile = data.image[0];
        createBrand.mutate(
            {name: data.name, imageFile},
            {
                onSuccess: () => {
                    toast.success("Brand was created correctly");
                    reset();
                    setPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                },
                onError: () => {
                    toast.error("Hubo un error al crear la brand.");
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className=" w-full max-w-[500px]">
            <Flex className="flex-col gap-[4rem]">
                <Flex className="flex-col gap-[2rem]">
                    <Flex className={'flex-col gap-[1rem]'}>
                        <Label htmlFor="name_brand" className="text-secondary_text_dark">
                            Name
                        </Label>
                        <Input
                            type="text"
                            id="name_brand"
                            placeholder="Brand name"
                            {...register("name", {required: "El nombre es obligatorio"})}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </Flex>
                    <Flex className={'flex-col gap-[1rem]'}>
                        <Label htmlFor="image_brand" className="text-secondary_text_dark">
                            Select an image
                        </Label>
                        <div>

                        <Button
                            id="image_brand"
                            type="button"
                            variant="outline"
                            onClick={handleIconClick}
                            className="flex gap-[1rem]"
                        >
                            <ImageUp className="w-6 h-6"/> Upload image
                        </Button>
                        </div>
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                        />

                        {errors.image && (
                            <p className="text-sm text-red-500">La imagen es obligatoria</p>
                        )}

                        {preview && (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-32 h-32 object-cover mt-2"
                            />
                        )}
                    </Flex>

                </Flex>


                <Button type="submit" disabled={createBrand.isPending}>
                    {createBrand.isPending ? "Saving..." : "Create new Brand"}
                </Button>
            </Flex>
        </form>
    );
}
