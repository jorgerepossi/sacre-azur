import { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useFetchBrands } from "@/hooks/useFetchBrands";

import { supabase } from "@/lib/supabaseClient";

type FormValues = {
  name: string;
  description: string;
  price: number;
  profit_margin: number;
  external_link: string;
  brand_id: string;
  image?: FileList;
  in_stock: boolean;
};

export function useEditPerfume() {
  const { control, handleSubmit, setValue, register, reset } =
    useForm<FormValues>();
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalPath, setOriginalPath] = useState<string | null>(null);

  const {
    data: brands,
    isLoading: brandsLoading,
    error: brandsError,
  } = useFetchBrands();
  const router = useRouter();
  const searchParams = useSearchParams();
  const perfumeId = searchParams.get("id");

  useEffect(() => {
    if (!perfumeId) return;

    const fetchPerfume = async () => {
      const { data, error } = await supabase
        .from("perfume")
        .select("*")
        .eq("id", perfumeId)
        .single();

      if (error || !data) {
        toast.error("Error loading perfume data");
        return;
      }

      reset({
        name: data.name,
        description: data.description,
        price: data.price,
        profit_margin: data.profit_margin,
        external_link: data.external_link,
        brand_id: data.brand_id,
        in_stock: data.in_stock,
      });

      const path = data.image?.replace(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/perfume-images/`,
        "",
      );

      setPreview(data.image);
      setOriginalPath(path || null);
      setLoading(false);
    };

    fetchPerfume();
  }, [perfumeId, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      setValue("image", e.target.files as FileList);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    let imageUrl = preview;

    if (data.image && data.image[0] && originalPath) {
      const { error: uploadError } = await supabase.storage
        .from("perfume-images")
        .upload(originalPath, data.image[0], { upsert: true });

      if (uploadError) {
        toast.error("Error uploading image");
        setLoading(false);
        return;
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/perfume-images/${originalPath}`;
    }

    const updates = {
      name: data.name,
      description: data.description,
      price: data.price,
      profit_margin: data.profit_margin,
      external_link: data.external_link,
      brand_id: data.brand_id,
      image: imageUrl,
      in_stock: data.in_stock,
    };

    const { error } = await supabase
      .from("perfume")
      .update(updates)
      .eq("id", perfumeId);

    if (error) {
      toast.error("Failed to update perfume");
    } else {
      toast.success("Perfume updated successfully!");
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return {
    control,
    handleSubmit,
    register,
    loading,
    preview,
    brands,
    brandsLoading,
    brandsError,
    handleImageChange,
    onSubmit,
  };
}
