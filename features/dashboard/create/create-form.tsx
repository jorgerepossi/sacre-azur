"use client";
import React, {useState, useRef} from "react";
import {useForm, Controller} from "react-hook-form";
import {useCreatePerfume} from "@/hooks/useCreatePerfume";
import {useFetchBrands} from "@/hooks/useFetchBrands";

import Flex from "@/components/flex";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

import { Upload } from "lucide-react";
import { ImageUp } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,

    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {toast} from 'react-hot-toast'
import {Brand} from "@/types/perfume.type";
import {Label} from "@/components/ui/label";
import RichTextEditor from "@/components/rich-text-editor";

type FormValues = {
    name: string;
    description: string;
    price: number;
    profit_margin: number;
    external_link: string;
    image: FileList;
    brand_id: string;
};

const CreateForm = () => {
    const {control, handleSubmit, register, reset} = useForm<FormValues>();
    const [preview, setPreview] = useState<string | null>(null);
    const createPerfume = useCreatePerfume();
    const {data: brands, isLoading, error} = useFetchBrands();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    console.log(brands)

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };
    if (isLoading || error || !brands) {
        return null;
    }


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleOnSubmit = (data: FormValues) => {
        const imageFile = data.image[0];

        createPerfume.mutate(
            {
                name: data.name,
                description: data.description,
                price: data.price,
                profit_margin: data.profit_margin,
                external_link: data.external_link,
                imageFile,
                brand_id: data.brand_id,
            },
            {
                onSuccess: () => {
                    toast.success("Perfume creado correctamente!");


                    reset({
                        name: "",
                        description: "",
                        price: 0,
                        profit_margin: 0,
                        external_link: "",
                        brand_id: "",
                        image: undefined,
                    });


                    setPreview(null);


                    const fileInput = document.querySelector("input[type='file']") as HTMLInputElement;
                    if (fileInput) {
                        fileInput.value = "";
                    }
                },
                onError: (error) => {
                    console.error("Error creando perfume:", error);
                    toast.error("Hubo un error al crear el perfume.");
                },
            }
        );
    };


    return (
        <form onSubmit={handleSubmit(handleOnSubmit)} className="max-w-[700px]">
            <Flex className="flex-col gap-[3rem]">
                <Flex className="flex-col gap-[1.5rem]">
                    <Controller
                        control={control}
                        name="name"
                        rules={{required: "El nombre es obligatorio"}}
                        render={({field}) => <Flex className={'flex-col gap-[1rem]'}>
                            <Label htmlFor={'name'} className={'!text-secondary_text_dark text-headline-subtitle'} >Name</Label>
                            <Input {...field} id={'name'} type="text" placeholder="Name"/>
                        </Flex>


                    }
                    />

                    <Controller
                        control={control}
                        name="description"
                        render={({field}) =>
                            <Flex className={'flex-col gap-[1rem]'}>
                                <Label htmlFor={'description'} className={'!text-secondary_text_dark text-headline-subtitle'}> Description</Label>
                                <Input {...field} id={'description'} type="text" placeholder="This fragrance is..."/>
                            </Flex>
                        }
                    />

                    <RichTextEditor />

                    <Flex className="gap-[1rem]">
                        <Controller
                            control={control}
                            name="price"
                            render={({field}) =>
                                <Flex className={'flex-col gap-[1rem]'}>
                                    <Label htmlFor={'price'} className={'!text-secondary_text_dark text-headline-subtitle'}>  Price </Label>
                                    <Input {...field} type="number" id={'price'} placeholder="10000"/>
                                </Flex>
                            }
                        />
                        <Controller
                            control={control}
                            name="profit_margin"
                            render={({field}) =>
                                <Flex className={'flex-col gap-[1rem]'}>
                                    <Label htmlFor={'profit'} className={'!text-secondary_text_dark text-headline-subtitle'}>  Profit </Label>
                                    <Input {...field} type="number" id={'profit'} placeholder="35, 50 ..."/>
                                </Flex>
                            }
                        />

                        <Controller
                            control={control}
                            name="brand_id"
                            rules={{required: "Choose Brand"}}
                            render={({field}) => (
                                <Flex className={'flex-col gap-[1rem] w-full'}>
                                    <Label htmlFor={'brand_id'} className={'!text-secondary_text_dark text-headline-subtitle'}>  Select Brand </Label>
                                    <Select

                                        onValueChange={field.onChange}
                                        value={field.value ?? ""}
                                    >
                                        <SelectTrigger className="border p-2 rounded">
                                            <SelectValue placeholder="Choose Brand"/>
                                        </SelectTrigger>

                                        <SelectContent id={'brand_id'} className="w-full">
                                            <SelectGroup>
                                                {isLoading ? (
                                                    <SelectItem value="loading" disabled>
                                                        Loading brands...
                                                    </SelectItem>
                                                ) : error ? (
                                                    <SelectItem value="error" disabled>
                                                        Error loading brands
                                                    </SelectItem>
                                                ) : (
                                                    brands
                                                        ?.slice()
                                                        .sort((a, b) => a.name.localeCompare(b.name))
                                                        .map((brand: Brand) => (
                                                            <SelectItem key={brand.id} value={brand.id}>
                                                                {brand.name}
                                                            </SelectItem>
                                                        ))
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Flex>

                            )}
                        />


                    </Flex>

                    <Controller
                        control={control}
                        name="external_link"
                        render={({field}) =>
                            <Flex className={'flex-col gap-[1rem] w-full'}>
                                <Label htmlFor={'external_link'} className={'!text-secondary_text_dark text-headline-subtitle'}>  External Link</Label>
                                <Input {...field} type="text" id={'external_link'} placeholder="External Link"/>
                            </Flex>
                        }
                    />

                    <Flex className={'gap-[1rem]'}>
                        <Button type="button" variant={'outline'} onClick={handleIconClick} className={'flex gap-[1rem]'}>
                            <ImageUp className="w-6 h-6 text-muted-foreground"/> <span> Upload image</span>
                        </Button>
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            {...register("image", {required: true})}
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="border p-2 rounded"
                        />
                    </Flex>


                    {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2"/>}
                </Flex>

                <Button type="submit" disabled={createPerfume.isPending}>
                    {createPerfume.isPending ? "Saving..." : "Create New"}
                </Button>
            </Flex>
        </form>
    );
};

export default CreateForm;
