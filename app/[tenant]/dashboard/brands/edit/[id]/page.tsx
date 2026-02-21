"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { ImageUp, ArrowLeft } from "lucide-react";

import Flex from "@/components/flex";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Brand } from "@/types/perfume.type";
import { useFetchBrands } from "@/hooks/useFetchBrands";
import { useUpdateBrand } from "@/hooks/useUpdateBrand";
import { useTenantLink } from "@/hooks/useTenantLink";

interface RouteParams {
  tenant: string;
  id: string;
}

type FormValues = {
  name: string;
  slug: string;
  image: FileList;
};

export default function BrandEditPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { tenant, id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useFetchBrands();
  const updateBrand = useUpdateBrand();
  const { getLink } = useTenantLink();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const brand = data?.find((b: Brand) => b.id === id);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<FormValues>();

  useEffect(() => {
    if (brand) {
      reset({
        name: brand.name,
        slug: brand.slug,
      });
      if (brand.image) {
        setPreview(brand.image);
      }
    }
  }, [brand, reset]);

  if (isLoading)
    return <div className="p-10 text-center">Cargando marca...</div>;

  if (!brand)
    return <div className="p-10 text-center">Marca no encontrada</div>;

  const handleBack = () => {
    router.back();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setValue("image", files, { shouldDirty: true });
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (formData: FormValues) => {
    const imageFile = formData.image?.[0];

    updateBrand.mutate(
      {
        id,
        name: formData.name,
        slug: formData.slug,
        imageFile,
        currentImageUrl: brand.image,
      },
      {
        onSuccess: () => {
          toast.success("Marca actualizada correctamente");
          router.push(getLink("/dashboard/brands"));
        },
        onError: () => {
          toast.error("Hubo un error al actualizar la marca.");
        },
      },
    );
  };

  return (
    <Flex className="flex-col gap-6">
      <Button
        variant="ghost"
        className="w-fit gap-2 px-0 hover:bg-transparent"
        onClick={handleBack}
      >
        <ArrowLeft size={16} />
        Volver
      </Button>

      <Card className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <h1 className="text-2xl font-bold">Editando Marca: {brand.name}</h1>

          <Flex className="flex-col gap-6">
            <Flex className="flex-col gap-6 lg:flex-row">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Nombre de la marca"
                  {...register("name", { required: "El nombre es obligatorio" })}
                />
              </div>

              <div className="flex-1 space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="Slug"
                  {...register("slug", { required: "El slug es obligatorio" })}
                />
              </div>
            </Flex>

            <div className="space-y-4">
              <Label>Imagen de la Marca</Label>
              <div className="flex items-center gap-6">
                <div className="relative h-32 w-32 overflow-hidden rounded-md border bg-muted">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Brand preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground text-xs text-center p-2">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleIconClick}
                    className="flex gap-2"
                  >
                    <ImageUp size={18} />
                    {brand.image ? "Cambiar Imagen" : "Subir Imagen"}
                  </Button>
                  <Input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG o WEBP. Recomendado 400x400px.
                  </p>
                </div>
              </div>
            </div>
          </Flex>

          <Flex className="gap-4 pt-4">
            <Button
              type="submit"
              disabled={updateBrand.isPending || (!isDirty && !preview?.startsWith("blob:"))}
            >
              {updateBrand.isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Button variant="outline" type="button" onClick={handleBack}>
              Cancelar
            </Button>
          </Flex>

          <details className="mt-8 border-t pt-4">
            <summary className="cursor-pointer text-xs text-muted-foreground">
              Ver JSON completo
            </summary>
            <pre className="mt-2 rounded bg-muted p-4 text-[10px] overflow-auto">
              {JSON.stringify(brand, null, 2)}
            </pre>
          </details>
        </form>
      </Card>
    </Flex>
  );
}
