"use client";
import {Controller} from "react-hook-form";
import {useEditPerfume} from "@/hooks/useEditPerfume";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Card} from "@/components/ui/card";
import Flex from "@/components/flex";
import {Label} from "@/components/ui/label";
import React from "react";

export default function EditPerfumeContent() {
    const {
        control,
        handleSubmit,
        loading,
        preview,
        brands,
        brandsLoading,
        brandsError,
        handleImageChange,
        onSubmit,
    } = useEditPerfume();

    if (loading || !brands) {
        return null;
    }


    console.log('preview', preview)

    return (
        <Card className="max-w-[700px] mx-auto p-[1.5rem] gap-[2rem]">
            <h2 className="text-2xl font-bold mb-4">Edit Perfume</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[2rem]">
                <Controller name="name" control={control} render={({field}) =>
                    <Flex className={'flex-col gap-[1rem] w-full'}>
                        <Label htmlFor={'name'} className={'text-muted-foreground'}> Name</Label>
                        <Input {...field} id={'name'} type="text" placeholder="Name"/>
                    </Flex>
                }/>
                <Controller name="description" control={control} render={({field}) =>
                    <Flex className={'flex-col gap-[1rem] w-full'}>
                        <Label htmlFor={'description'} className={'text-muted-foreground'}> Description</Label>
                        <Textarea {...field} id={'description'} placeholder="Description" className={'!min-h-[150px]'}/>
                    </Flex>
                }/>

                <div className="flex gap-4">
                    <Flex className={'flex-col gap-[1rem]'}>
                        <Controller name="price" control={control} render={({field}) =>
                            <Flex className={'flex-col gap-[1rem] w-full'}>
                                <Label htmlFor={'price'} className={'text-muted-foreground'}> Price</Label>
                                <Input {...field} id={'price'} type="number" placeholder="Price"/>
                            </Flex>
                        }
                        />
                    </Flex>
                    <Flex className={'flex-col gap-[1rem]'}>
                        <Controller name="profit_margin" control={control} render={({field}) =>
                            <Flex className={'flex-col gap-[1rem] w-full'}>
                                <Label htmlFor={'profit'} className={'text-muted-foreground'}> Profit</Label>
                                <Input {...field} id={'profit'} type="number" placeholder="Profit"/>
                            </Flex>
                        }/>
                    </Flex>
                    <Controller
                        control={control}
                        name="brand_id"
                        rules={{required: "Choose Brand"}}
                        render={({field}) => (
                            <Flex className={'flex-col gap-[1rem] w-full'}>
                                <Label htmlFor={'brand_id'} className={'text-muted-foreground'}> Change Brand </Label>
                                <Select onValueChange={field.onChange} value={field.value || brands?.[0]?.id}>
                                    <SelectTrigger className="border p-2 rounded">
                                        <SelectValue placeholder="Select a Brand"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {brandsLoading ? (
                                                <SelectItem value="loading" disabled>Loading brands...</SelectItem>
                                            ) : brandsError ? (
                                                <SelectItem value="error" disabled>Error loading brands</SelectItem>
                                            ) : (
                                                brands
                                                    ?.slice()
                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((brand) => (
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
                </div>

                <Controller name="external_link" control={control} render={({field}) =>
                    <Flex className={'flex-col gap-[1rem] w-full'}>
                        <Label htmlFor={'external_link'} className={'text-muted-foreground'}> External Link</Label>
                        <Input {...field} id={'external_link'} type="text" placeholder="External Link"/>
                    </Flex>}
                />


                <input type="file" accept="image/*" onChange={handleImageChange} className="border p-2 rounded"/>


                {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover mt-2"/>}
                <Flex className={'w-full gap-[1rem]'}>
                    <Button type={'button'} variant={'outline'} className={'flex-1'}>Cancel </Button>
                    <Button type="submit" disabled={loading} className={'flex-1'}>
                        {loading ? "Saving..." : "Update Perfume"}
                    </Button>
                </Flex>
            </form>
        </Card>
    );
}
