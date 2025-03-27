import { useRef, useState } from "react";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import { useFetchNotes } from "@/hooks/fetchs/useFetchNotes";
import { useCreatePerfume } from "@/hooks/useCreatePerfume";
import { useFetchBrands } from "@/hooks/useFetchBrands";

export type FormValues = {
  name: string;
  description: string;
  price: number;
  profit_margin: number;
  external_link: string;
  image: FileList;
  brand_id: string;
  note_ids: string[];
};

export const useCreatePerfumeForm = () => {
  const { control, handleSubmit, register, reset, setValue } =
    useForm<FormValues>();
  const [preview, setPreview] = useState<string | null>(null);
  const createPerfume = useCreatePerfume();
  const { data: brands, isLoading, error } = useFetchBrands();
  const { data: notes } = useFetchNotes();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      setValue("image", e.target.files);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
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
          reset();
          setPreview(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onError: () => {
          toast.error("Hubo un error al crear el perfume.");
        },
      },
    );
  };

  return {
    control,
    handleSubmit,
    register,
    reset,
    preview,
    setPreview,
    handleImageChange,
    handleIconClick,
    handleOnSubmit,
    createPerfume,
    brands,
    isLoading,
    error,
    fileInputRef,
    notes,
    setValue,
  };
};
