"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBrand } from "@/hooks/useCreateBrand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Flex from "@/components/flex";
import {toast} from "react-hot-toast";
import {Label} from "@/components/ui/label";

type FormValues = {
    name: string;
    image: FileList;
};

export default function CreateBrandForm() {
    const createBrand = useCreateBrand();
    const { register, handleSubmit, reset } = useForm<FormValues>();
    const [preview, setPreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setPreview(URL.createObjectURL(file));
        }
    };

    const onSubmit = (data: FormValues) => {
        const imageFile = data.image[0];
        createBrand.mutate({ name: data.name, imageFile },{
            onSuccess: () => {
                toast.success('Brand was created correctly');
                reset();
                setPreview(null);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-[500px]">
            <Flex className="flex-col gap-[1.5rem]">
                <Flex className={'flex-col gap-[1rem]'}>
                    <Label htmlFor={'name_brand'} className={'text-secondary_text_dark'}>  Name</Label>
                <Input type="text" id={'name_brand'} placeholder="Brand name" {...register("name", { required: true })} />
                </Flex>
                <input
                    type="file"
                    accept="image/*"
                    {...register("image", { required: true })}
                    onChange={handleImageChange}
                />

                {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2" />}

                <Button type="submit" disabled={createBrand.isPending}>
                    {createBrand.isPending ? "Saving..." : "Create new Brand"}
                </Button>
            </Flex>
        </form>
    );
}
